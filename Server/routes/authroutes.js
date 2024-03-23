const express = require('express');
const router = express.Router();
const authcontrol = require('../controllers/auth'); 

// Route for login page
router.get('/login', (req, res) => {
    res.send('Hello, login page');
});

// Route for handling login form submission (POST request)
router.post('/login', authcontrol.login);

// Route for signup page
router.get('/signup', (req, res) => {
    res.send('Hello, signup page');
});

// Route for handling sign up form submission (POST request)
router.post('/signup', authcontrol.signup);

module.exports = router;
