const express = require('express');
const router = express.Router();
const { User } = require('../models');
const  { University } = require('../models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// регистрация нового пользователя
router.post('/register', async (req, res) => {
    try {
        const { email, password, fio, university, role } = req.body;

        // Проверка, существует ли уже такой email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Хеширование пароля перед сохранением
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const newUser = await User.create({
            email,
            password: hashedPassword,
            fio,
            university,
            role
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.fio,
                email: newUser.email,
                uni: newUser.university,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// авторизация пользователя
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Поиск пользователя по email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Создание JWT токена
        const token = jwt.sign({ id: user.id, username: user.fio }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.fio,
                email: user.email,
                uni: user.university,
                role: user.role,
                universityId: user.universityId
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Middleware для проверки JWT токена
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        res.status(403).json({ message: "Неверный токен" });
    }
};

//получение информации о пользователе по ID
router.get('/:userId', authenticateJWT, async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);

        if (user) {
            // Удаляем пароль из объекта перед отправкой
            const userData = user.get();
            delete userData.password;  // Убираем пароль из данных

            res.status(200).json(userData);  // Отправляем данные без пароля
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Получение информации об университете, к которому привязан пользователь
router.get('/:id/university', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: {
                model: University,
                attributes: 'id'
            }
        });

        if (user) {
            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.fio,
                    email: user.email
                },
                university: user.University // Привязанный университет
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// обновление информации о пользователе
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const updatedUser = await user.update(req.body);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// удаление пользователя
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = {
    router,
    authenticateJWT,
};
