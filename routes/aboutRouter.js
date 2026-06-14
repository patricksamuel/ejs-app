// routes/aboutRouter.js
const express = require("express");
const router = express.Router();              // Router(), NOT express()
const { aboutController } = require("../controllers/aboutController");

router.get("/", aboutController);      // by name, no () — don't call it

module.exports = router;