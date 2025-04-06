const express = require('express');
const router = express.Router();
const { Assessment } = require('../models');

// Добавление нового ассессмента
router.post('/', async (req, res) => {
    try {
        const assessment = await Assessment.create(req.body);
        res.status(201).json(assessment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Получение всех ассессментов
router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment.findAll();
        res.status(200).json(assessments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Редактирование ассессмента
router.put('/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findByPk(req.params.id);
        if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

        const updated = await assessment.update(req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Удаление ассессмента
router.delete('/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findByPk(req.params.id);
        if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

        await assessment.destroy();
        res.status(200).json({ message: 'Assessment deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
