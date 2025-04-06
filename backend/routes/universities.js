const express = require('express');
const router = express.Router();
const { University, Program } = require('../models');

// Получить список университетов
router.get('/', async (req, res) => {
    try {
        const universities = await University.findAll();
        res.status(200).json(universities);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Получить университет по ID
router.get('/:id', async (req, res) => {
    try {
        const university = await University.findByPk(req.params.id);
        if (university) {
            res.status(200).json(university);
        } else {
            res.status(404).json({ error: 'University not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Получение всех программ конкретного университета
router.get('/:id/programs', async (req, res) => {
    try {
        const university = await University.findByPk(req.params.id, {
            include: {
                model: Program,
                through: { attributes: [] } // не включать поля из таблицы-связки
            }
        });

        if (!university) {
            return res.status(404).json({ error: 'University not found' });
        }

        res.status(200).json(university.Program);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Добавить новый университет
router.post('/', async (req, res) => {
    try {
        const { name, logo } = req.body; // Примерные поля университета, можно добавить другие

        // Проверка, существует ли уже университет с таким именем
        const existingUniversity = await University.findOne({ where: { name } });
        if (existingUniversity) {
            return res.status(400).json({ error: 'University with this name already exists' });
        }

        // Создание нового университета
        const newUniversity = await University.create({
            name,
            logo
        });

        res.status(201).json({
            message: 'University created successfully',
            university: {
                id: newUniversity.id,
                name: newUniversity.name
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Обновить университет по ID
router.put('/:id', async (req, res) => {
    try {
        const university = await University.findByPk(req.params.id);
        if (university) {
            const updatedUniversity = await university.update(req.body);
            res.status(200).json(updatedUniversity);
        } else {
            res.status(404).json({ error: 'University not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Удалить университет по ID
router.delete('/:id', async (req, res) => {
    try {
        const university = await University.findByPk(req.params.id);
        if (university) {
            await university.destroy();
            res.status(200).json({ message: 'University deleted successfully' });
        } else {
            res.status(404).json({ error: 'University not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
