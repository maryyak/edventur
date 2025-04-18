const express = require('express');
const router = express.Router();
const { UserAssessment } = require('../models')
const {authenticateJWT} = require("./usersInfo");

// Получение результата ассессмента для конкретного пользователя
router.get('/:assessmentId', authenticateJWT, async (req, res) => {
    try {
        const { assessmentId } = req.params;
        const userId = req.user.id

        const relation = await UserAssessment.findOne({
            where: { userId, assessmentId }
        });

        if (!relation) {
            return res.status(200).json(null)
        }

        return res.status(200).json({
            userId: relation.userId,
            assessmentId: relation.assessmentId,
            result: relation.result
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { userId, assessmentId, result } = req.body;

        if (!userId || !assessmentId || result === undefined) {
            return res.status(400).json({ error: 'userId, assessmentId и result обязательны' });
        }

        // Проверяем, есть ли уже такая запись
        const [relation, created] = await UserAssessment.findOrCreate({
            where: { userId, assessmentId },
            defaults: { result }
        });

        // Если запись уже существует, обновляем результат
        if (!created) {
            relation.result = result;
            await relation.save();
        }

        res.status(200).json({
            message: created ? 'Результат успешно сохранён' : 'Результат обновлён',
            data: {
                userId: relation.userId,
                assessmentId: relation.assessmentId,
                result: relation.result
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Удаление связи между пользователем и ассессментом
router.delete('/', async (req, res) => {
    try {
        const { userId, assessmentId } = req.body;

        const deletedCount = await UserAssessment.destroy({
            where: { userId, assessmentId }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Relation not found' });
        }

        res.status(200).json({ message: 'Relation deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
