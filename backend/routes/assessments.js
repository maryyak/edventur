const express = require('express');
const router = express.Router();
const {Assessment, University, UserAssessment} = require('../models');
const {authenticateJWT} = require("../routes/usersInfo");

// Добавление нового ассессмента
router.post('/', async (req, res) => {
    try {
        const assessment = await Assessment.create(req.body);
        res.status(201).json(assessment);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// Получение всех ассессментов
router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment.findAll({
            include: [{
                model: University
            }]
        });
        res.status(200).json(assessments);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(assessment);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.post('/:id/submit', authenticateJWT, async (req, res) => {
    const assessmentId = req.params.id;
    const {answers} = req.body;  // { [questionId]: optionId, … }

    try {
        const assessment = await Assessment.findByPk(assessmentId);
        if (!assessment) {
            return res.status(404).json({error: 'Assessment not found'});
        }

        const questions = assessment.questions;
        if (!Array.isArray(questions)) {
            return res.status(400).json({error: 'Invalid questions format'});
        }

        let correctCount = 0;
        for (const q of questions) {
            const userAnswer = answers[q.id];
            if (userAnswer != null && userAnswer.toString() === q.correctOptionId.toString()) {
                correctCount++;
            }
        }

        const total = questions.length;
        const scorePercent = Math.round((correctCount / total) * 100);

        await UserAssessment.create({
            userId: req.user.id,
            assessmentId,
            result: scorePercent
        });

        return res.json({
            totalQuestions: total,
            correctAnswers: correctCount,
            score: scorePercent
        });
    } catch (err) {
        console.error('Error checking assessment result:', err);
        return res.status(500).json({error: err.message});
    }
});

//Получение всех ассессментов конкретного университета
router.get('/university/:universityId', async (req, res) => {
    const {universityId} = req.params;
    try {
        const universityAssessments = await University.findByPk(universityId, {
            include: [{
                model: Assessment
            }]
        });

        if (!universityAssessments) {
            console.log("Университет не найден")
            return res.status(404).json({error: "Университет не найден"});
        }

        res.status(200).json(universityAssessments);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


// Редактирование ассессмента
router.put('/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findByPk(req.params.id);
        if (!assessment) return res.status(404).json({error: 'Assessment not found'});
        const updated = await assessment.update(req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// Удаление ассессмента
router.delete('/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findByPk(req.params.id);
        if (!assessment) return res.status(404).json({error: 'Assessment not found'});

        await assessment.destroy();
        res.status(200).json({message: 'Assessment deleted'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


module.exports = router;
