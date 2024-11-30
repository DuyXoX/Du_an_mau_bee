const express = require('express');
const emailRouter = express.Router();
const { sendEmail } = require('../controllers/email');

emailRouter.post("/", async (req, res) => {//Gửi Mail
    return sendEmail(req, res);
});

module.exports = emailRouter;
