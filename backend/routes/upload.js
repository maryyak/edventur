const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require('csvtojson');
const XLSX = require('xlsx');
const {User, Program, UserProgram, Application} = require('../models');
const {authenticateJWT} = require("../routes/usersInfo");
const axios = require("axios");

const router = express.Router();

// Настраиваем хранилище для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Папка для загрузки
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Генерация уникального имени
    }
});

const upload = multer({storage});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function askOpenAISimilarity(course1, course2) {
    const prompt = `
Сравни два учебных плана с учётом:
1. Уровня образования (бакалавриат, магистратура и т.п.) — самый важный фактор.
2. Списка дисциплин по названиям — основной критерий.
3. Длительности курсов — не учитывай.

Верни только одно число от 0 до 1 (с двумя знаками после запятой):
- 1.00 — полное совпадение по уровню образования и набору дисциплин.
- 0.00 — полное различие.

‼️ Не объясняй, не комментируй, не пиши формулы или списки. Только число.

Формат ответа: 0.00

1) "${course1}"
2) "${course2}"

Ответ:
`;

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: "anthropic/claude-3-haiku",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const reply = response.data.choices[0].message.content.trim();
        const number = parseFloat(reply);
        const roundedSimilarity = Math.round(number * 100) / 100;
        if (isNaN(roundedSimilarity)) {
            console.warn('Не удалось распарсить число. Ответ модели:', reply);
            return 0;
        }
        return roundedSimilarity;
    } catch (error) {
        console.error('Ошибка при обращении к OpenAI:', error.response?.data || error.message);
        return 0;
    }
}

function planToString(plan) {
    if (!plan || typeof plan !== 'object') return 'Недопустимый план';

    let str = `Программа: ${plan.program ?? 'нет данных'}\n`;
    str += `Степень: ${plan.degree ?? 'нет данных'}\n`;

    if (Array.isArray(plan.semesters)) {
        plan.semesters.forEach((semester) => {
            str += `Семестр ${semester.semester ?? 'неизвестен'}:\n`;
            if (Array.isArray(semester.courses)) {
                semester.courses.forEach((course, index) => {
                    str += `  ${index + 1}. ${course.name ?? 'без названия'} – ${course.hours ?? '?'} часов, `;
                    str += `Тип: ${course.type ?? '?'}, Оценивание: ${course.assessment ?? '?'}\n`;
                });
            }
            str += `\n`;
        });
    }

    return str;
}


async function calculateSimilarity(userPlan, existingPlan) {
    const userStr = planToString(userPlan);
    const refStr = planToString(existingPlan);
    return await askOpenAISimilarity(userStr, refStr);
}

router.post("/", authenticateJWT, upload.single("file"), async (req, res) => {
    try {
        const fileType = req.query.type;
        const userId = req.user.id;

        const allowedFields = ['studyplan', 'scoreDoc', 'application', 'programStudyplan'];

        if (!fileType || !userId) {
            return res.status(400).json({ error: 'Missing file type or user' });
        }

        if (!allowedFields.includes(fileType)) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        const filePath = `${req.file.destination}/${req.file.filename}`;
        const fileLink = `uploads/${req.file.filename}`

        if (fileType === "scoreDoc") {
            await User.update(
                { scoreDoc: fileLink },
                { where: { id: userId } }
            );
            return res
                .status(200)
                .json({ message: "Файл с оценками загружен", url: fileLink });
        }
        else if (fileType === "application") {
            await Application.update(
                { document: fileLink },
                { where: { userId: userId, programId: req.body.programId } }
            );
            return res
                .status(200)
                .json({ message: "Файл с заявлением загружен", url: fileLink });
        }
        else {
            const ext = path.extname(req.file.originalname).toLowerCase();
            const fileBuffer = fs.readFileSync(filePath);
            let parsedData;

            if (ext === '.json') {
                parsedData = JSON.parse(fileBuffer.toString());
            } else if (ext === '.csv') {
                parsedData = await csv().fromString(fileBuffer.toString());
            } else if (ext === '.xlsx' || ext === '.xls') {
                const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                parsedData = XLSX.utils.sheet_to_json(sheet);
            } else {
                return res.status(400).json({ error: 'Unsupported file format' });
            }

            if (fileType === "programStudyplan") {
                await Program.update(
                    { studyplan: parsedData },
                    { where: { id: req.body.programId } }
                );
                return res
                    .status(200)
                    .json({ message: "Файл с учебным планом загружен", url: fileLink });
            } else {
                await User.update({ [fileType]: parsedData }, { where: { id: userId } });

                const programs = await Program.findAll();

                for (const program of programs) {
                    const programStudyPlan = program.studyplan;
                    const similarity = await calculateSimilarity(parsedData, programStudyPlan);

                    await UserProgram.upsert({
                        userId,
                        programId: program.id,
                        similarityPercentage: similarity,
                    });
                }

                fs.unlinkSync(filePath);
            }
        }

        res.status(200).json({ message: `${fileType} uploaded and processed` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

module.exports = router;
