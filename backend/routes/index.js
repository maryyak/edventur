const express = require("express");
const router = express.Router();

// Когда добавляем новую таблицу прописываем тут название для api
// Пример : router.use("/disciplines", require("./disciplines"));
router.use("/user", require("./usersInfo"))
router.use("/universities", require("./universities"))
router.use("/programs", require("./programs"))
router.use("/assessments", require("./assessments"))
router.use("/user-assessments", require("./userAssessments"))
router.use("/university-programs", require("./universityPrograms"))
router.use("/applications", require("./applications"))

module.exports = router;
