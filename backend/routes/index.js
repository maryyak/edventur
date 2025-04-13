const express = require("express");
const router = express.Router();

const { router: userRouter } = require("./usersInfo");

router.use("/user", userRouter)
router.use("/universities", require("./universities"))
router.use("/programs", require("./programs"))
router.use("/assessments", require("./assessments"))
router.use("/user-assessments", require("./userAssessments"))
router.use("/university-programs", require("./universityPrograms"))
router.use("/applications", require("./applications"))
router.use("/upload", require("./upload"));

module.exports = router;
