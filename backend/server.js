require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Тестовый маршрут
app.get("/", (req, res) => {
    res.send("Сервер работает!");
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

const routes = require("./routes");
app.use("/api", routes);
