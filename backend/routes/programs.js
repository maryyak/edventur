const express = require('express');
const router = express.Router();
const { Program } = require('../models');
const  { University, UserProgram, UniversityProgram, User } = require('../models')


// Получить список программ
router.get('/', async (req, res) => {
    try {
        const programs = await Program.findAll({
            include: [
                {
                    model: University,
                    through: {attributes: []}
                },
                {
                    model: UserProgram
                }
            ]
        });
        res.status(200).json(programs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Добавление новой программы
router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            level,
            form,
            seats,
            duration,
            additionally,
            similarity,
            min_similarity,
            studyplan,
            reviews,
            assessment
        } = req.body;

        const newProgram = await Program.create({
            title,
            description,
            level,
            form,
            seats,
            duration,
            additionally,
            similarity,
            min_similarity,
            studyplan,
            reviews,
            assessment
        });

        res.status(201).json({
            message: 'Program created successfully',
            program: newProgram
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const program = await Program.findByPk(req.params.id);
        if (!program) {
            return res.status(404).json({ error: 'Program not found' });
        }
        res.status(200).json(program);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id/representative', async (req, res) => {
    try {
        const program = await Program.findByPk(req.params.id, {
            include: {
                model: University,
                include: {
                    model: User,
                }
            }
        });

        if (!program) {
            return res.status(404).json({ error: 'Program not found' });
        }

        const representative = program.Universities[0].Users[0]

        res.status(200).json(representative);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Обновить программу по ID
router.put('/:id', async (req, res) => {
    try {
        const program = await Program.findByPk(req.params.id);

        if (!program) {
            return res.status(404).json({ error: 'Program not found' });
        }

        const updatedProgram = await program.update(req.body);
        res.status(200).json(updatedProgram);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await UniversityProgram.destroy({
            where: { programId: id }
        });

        await Program.destroy({
            where: { id: id }
        });

        res.status(200).json({ message: 'Program deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
