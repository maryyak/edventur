const express = require('express');
const router = express.Router();
const { Application, User, University, Program } = require('../models');
const {authenticateJWT} = require("../routes/usersInfo");

// Получить все заявки
router.get('/', async (req, res) => {
    try {
        const applications = await Application.findAll({
            include: [User, University, Program]
        });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить все заявки пользователя
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const applications = await Application.findAll({
            where: { userId },
            include: [Program]
        });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Получить все заявки по данной программе
router.get('/program/:programId', async (req, res) => {
    try {
        const { programId } = req.params;
        const applications = await Application.findAll({
            where: { programId },
            include: [User]
        });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Получить все заявки для университета
router.get('/university/:universityId', async (req, res) => {
    try {
        const { universityId } = req.params;
        const applications = await Application.findAll({
            where: { universityId },
            include: [Program]
        });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новую заявку
router.post('/program/:id', authenticateJWT, async (req, res) => {
    try {
        const programId = req.params.id
        const program = await Program.findByPk(programId, {
            include: {
                model: University,
                attributes: ['id']
            }
        });
        const newApp = await Application.create(
            {
                userId: req.user.id,
                universityId: program.Universities[0].id,
                programId: programId,
                phone: req.body.phone
            }
        );
        res.status(201).json(newApp);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Обновить статус заявки
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const app = await Application.findByPk(id);
        if (!app) return res.status(404).json({ error: 'Заявка не найдена' });

        await app.update(req.body);
        res.status(200).json(app);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Удалить заявку
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Application.destroy({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
