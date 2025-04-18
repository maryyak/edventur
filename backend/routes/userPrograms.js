const express = require('express');
const router = express.Router();
const { UserProgram } = require('../models')
const {authenticateJWT} = require("./usersInfo");

router.post('/:id', authenticateJWT, async (req, res) => {
    try {
        const programId = req.params.id;
        const userId = req.user.id

        if (!userId || !programId) {
            return res.status(400).json({ error: 'userId и programId обязательны' });
        }

        // Если записи нет — создаём с clicks = 1, иначе получаем существующую
        const [userProgram, created] = await UserProgram.findOrCreate({
            where: { userId, programId },
            defaults: { clicks: 1 }
        });

        if (!created) {
            // Инкрементируем clicks
            userProgram.clicks = (userProgram.clicks || 0) + 1;
            await userProgram.save();
        }

        return res.status(200).json({
            message: 'Клик успешно сохранён',
            clicks: userProgram.clicks
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;