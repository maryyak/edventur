const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require('csvtojson');
const XLSX = require('xlsx');
const { User, Program, UserPrograms } = require('../models');
const { authenticateJWT } = require("../routes/usersInfo");
const axios = require("axios");
const qs = require('qs')
const {Agent} = require("node:https");

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

const upload = multer({ storage });

const gigaAuth = process.env.GIGA_AUTH;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const httpsAgent = new Agent({ rejectUnauthorized: false });
// Функция для получения токена
async function getToken() {
    // Конфигурация запроса для получения токена
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': crypto.randomUUID(),
            'Authorization': `Basic ${gigaAuth}`, // Проверьте, что gigaAuth корректно задана
        },
        data: qs.stringify({
            scope: 'GIGACHAT_API_PERS'
        }),
        httpsAgent
    };

    try {
        const response = await axios(config);
        // Извлекаем нужные поля из ответа
        const { access_token, expires_at } = response.data;
        console.log('Token received:', access_token);
        return { accessToken: access_token, expiresAt: expires_at };
    } catch (error) {
        // Выводим детальную информацию об ошибке, если запрос не прошёл
        console.error('Ошибка получения токена:', error.response ? error.response.data : error.message);
        throw error; // Выбрасываем ошибку дальше, чтобы вызвать её обработку в вызывающей функции
    }
}

function flattenCourses(plan) {
    const result = [];
    // Проверяем, что plan.semesters существует и является массивом
    if (!Array.isArray(plan.semesters)) return result;

    for (const semester of plan.semesters) {
        // У каждого семестра проверяем, что есть массив курсов
        if (Array.isArray(semester.courses)) {
            for (const course of semester.courses) {
                // Извлекаем нужную информацию (можно добавить дополнительные поля, если нужно)
                result.push({
                    name: course.name.trim(),
                    hours: course.hours || 0,
                    type: course.type,           // Дополнительная информация, если нужна
                    assessment: course.assessment  // Дополнительная информация, если нужна
                });
            }
        }
    }
    return result;
}

async function getAuthToken() {
    try {
        const token = await getToken();
        return token.accessToken;
    } catch (error) {
        console.error('Не удалось получить токен:', error);
        throw error;
    }
}

async function askGigaChatSimilarityWithToken(course1, course2, accessToken) {
    const prompt = `Сравни два названия дисциплины и верни число с плавающей точкой от 0 до 1, округленное до двух знаков, где 1 означает полное совпадение по смыслу, а 0 — полное отсутствие схожести.
Например:
- Если дисциплины очень похожи, можно вернуть 0.85.
- Если дисциплины сильно различаются, можно вернуть 0.30.
Верни только число, без пояснений и лишнего текста.
1) "${course1}"
2) "${course2}"
Ответ:`;

    try {
        const response = await axios.post(
            'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
            {
                model: 'GigaChat:latest',
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                httpsAgent
            }
        );
        const reply = response.data.choices[0].message.content;
        console.log(`Ответ от модели для "${course1}" и "${course2}":`, reply);
        const number = parseFloat(reply.trim());
        if (isNaN(number)) {
            console.warn('Не удалось распарсить число. Ответ модели:', reply);
            return 0;
        }
        return number;
    } catch (error) {
        console.error('Ошибка в askGigaChatSimilarity:', error.response ? error.response.data : error.message);
        return 0;
    }
}

async function calculateSimilarity(userPlan, existingPlan) {
    const userCourses = flattenCourses(userPlan); // [{name, hours}]
    const refCourses = flattenCourses(existingPlan);
    let totalScore = 0;
    let maxScore = 0;

    // Получаем токен один раз
    const accessToken = await getAuthToken();

    // Используем Promise.all для параллельной обработки, если это возможно
    for (const userCourse of userCourses) {
        // Для каждого курса находим лучший результат среди курсов из второго плана
        const similarityPromises = refCourses.map(refCourse =>
            askGigaChatSimilarityWithToken(userCourse.name, refCourse.name, accessToken)
                .then(similarity => {
                    // Модифицируем на основе разницы в часах
                    const hourRatio = Math.min(userCourse.hours, refCourse.hours) / Math.max(userCourse.hours, refCourse.hours);
                    return similarity * hourRatio;
                })
        );
        // Ждем, когда все сравнения для одного курса завершатся
        const similarities = await Promise.all(similarityPromises);
        const bestMatchScore = Math.max(...similarities);
        console.log(`Лучшая схожесть для "${userCourse.name}":`, bestMatchScore);
        totalScore += bestMatchScore;
        maxScore += 1;
    }

    return maxScore === 0 ? 0 : (totalScore / maxScore) * 100; // Возвращаем процент совпадения
}


router.post("/", authenticateJWT, upload.single("file"), async (req, res) => {
    try {
        const fileType = req.query.type;
        const userId = req.user.id; // <-- Теперь берём ID из токена

        if (!fileType || !userId) {
            return res.status(400).json({ error: 'Missing file type or user' });
        }

        const filePath = `${req.file.destination}/${req.file.filename}`;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const fileBuffer = fs.readFileSync(filePath);
        let parsedData;

        if (ext === '.json') {
            parsedData = JSON.parse(fileBuffer.toString());
        } else if (ext === '.csv') {
            parsedData = csv(fileBuffer.toString(), {
                columns: true,
                skip_empty_lines: true,
            });
        } else if (ext === '.xlsx' || ext === '.xls') {
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            parsedData = XLSX.utils.sheet_to_json(sheet);
        } else {
            return res.status(400).json({ error: 'Unsupported file format' });
        }

        // Обновляем нужное поле в зависимости от типа
        const allowedFields = ['studyplan'];
        if (!allowedFields.includes(fileType)) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        await User.update(
            { [fileType]: parsedData },
            { where: { id: userId } }
        );

        // Загружаем все программы
        const programs = await Program.findAll();

        // Обрабатываем все программы и вычисляем схожесть
        for (const program of programs) {
            const programStudyPlan = program.studyplan;  // Предположим, что учебный план программы хранится в поле `studyPlan`

            // Вычисляем схожесть с помощью нейросети Gigachat
            const similarity = await calculateSimilarity(parsedData, programStudyPlan);

            // Сохраняем данные о схожести
            await UserPrograms.create({
                userId,
                programId: program.id,
                similarityPercentage: similarity,
            });
        }

        // Удаляем файл после обработки
        fs.unlinkSync(filePath);

        res.status(200).json({ message: `${fileType} uploaded successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
});



module.exports = router;
