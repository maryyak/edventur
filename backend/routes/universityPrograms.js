const express = require('express');
const router = express.Router();
const { UniversityProgram, University, Program } = require('../models');

// Получить все связи между университетами и программами
router.get('/', async (req, res) => {
    try {
        const universityPrograms = await UniversityProgram.findAll();
        res.status(200).json(universityPrograms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить все программы для конкретного университета по id
router.get('/university/:universityId/programs', async (req, res) => {
    const { universityId } = req.params;
    try {
        const university = await University.findOne({
            where: { id: universityId },
        });

        if (!university) {
            return res.status(404).json({ error: 'University not found' });
        }

        const programs = await university.getPrograms();

        res.status(200).json(programs);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
});


// Получить все университеты для конкретной программы
router.get('/program/:programId/universities', async (req, res) => {
    const { programId } = req.params;
    try {
        const universities = await UniversityProgram.findAll({
            where: { programId },
            include: ['University'],  // Включаем связанную модель University
        });
        res.status(200).json(universities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать связь между университетом и программой
router.post('/university/:universityId/program/:programId', async (req, res) => {
    const { universityId, programId } = req.params;
    try {
        const existingLink = await UniversityProgram.findOne({
            where: { universityId, programId }
        });

        if (existingLink) {
            return res.status(400).json({ error: 'This program is already linked to this university' });
        }

        const newLink = await UniversityProgram.create({ universityId, programId });
        res.status(201).json({ message: 'Link created successfully', link: newLink });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новую программу и сразу связать её с университетом
router.post('/university/:universityId/programs', async (req, res) => {
    const { universityId } = req.params;
    const values = req.body; // или другие поля, нужные для создания программы

    try {
        // Проверим, существует ли университет
        const university = await University.findByPk(universityId);
        if (!university) {
            return res.status(404).json({ error: 'University not found' });
        }

        // Создаём программу
        const newProgram = await Program.create(values);

        // Создаём связь
        await UniversityProgram.create({
            universityId,
            programId: newProgram.id,
        });

        res.status(201).json({
            message: 'Program created and linked successfully',
            program: newProgram
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить связь между университетом и программой
router.delete('/university/:universityId/program/:programId', async (req, res) => {
    const { universityId, programId } = req.params;
    try {
        const link = await UniversityProgram.findOne({
            where: { universityId, programId }
        });

        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }

        await link.destroy();
        res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Проверка наличия связи между университетом и программой
router.get('/university/:universityId/program/:programId', async (req, res) => {
    const { universityId, programId } = req.params;
    try {
        const link = await UniversityProgram.findOne({
            where: { universityId, programId }
        });

        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }

        res.status(200).json(link);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить все связи для конкретного университета
router.delete('/university/:universityId/programs', async (req, res) => {
    const { universityId } = req.params;
    try {
        const links = await UniversityProgram.findAll({
            where: { universityId }
        });

        if (links.length === 0) {
            return res.status(404).json({ error: 'No links found for this university' });
        }

        await UniversityProgram.destroy({ where: { universityId } });
        res.status(200).json({ message: 'All links for the university have been deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить все связи для конкретной программы
router.delete('/program/:programId/universities', async (req, res) => {
    const { programId } = req.params;
    try {
        const links = await UniversityProgram.findAll({
            where: { programId }
        });

        if (links.length === 0) {
            return res.status(404).json({ error: 'No links found for this program' });
        }

        await UniversityProgram.destroy({ where: { programId } });
        res.status(200).json({ message: 'All links for the program have been deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
