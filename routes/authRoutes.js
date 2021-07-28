const { Router } = require('express');

const authController = require('../controller/authController');

const router = Router();

router.post('/login', authController.login);
router.get('/logout', authController.authenticate, authController.logout);

router.get('/verify', authController.authenticate, authController.verify);

module.exports = router;
