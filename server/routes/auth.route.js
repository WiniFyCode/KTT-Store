const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')

// Route đăng ký
router.post('/register', authController.register)

// Route đăng nhập
router.post('/login', authController.login)

// Route quên mật khẩu
router.post('/forgot-password', authController.forgotPassword)

// Route reset mật khẩu
router.post('/reset-password', authController.resetPassword)

module.exports = router
