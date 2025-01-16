const Customer = require('../models/Customer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// Lưu trữ OTP tạm thời (trong thực tế nên dùng Redis hoặc database)
const otpStore = new Map()

// Tạo và gửi OTP qua email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        // Kiểm tra email có tồn tại
        const customer = await Customer.findOne({ email })
        if (!customer) {
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' })
        }

        // Tạo OTP ngẫu nhiên 6 số
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        
        // Lưu OTP với thời gian hết hạn 5 phút
        otpStore.set(email, {
            otp,
            expiry: Date.now() + 5 * 60 * 1000 // 5 phút
        })

        // Gửi email chứa OTP
        const mailOptions = {
            from: {
                name: 'KTT Store',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Đặt lại mật khẩu KTT Store',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="padding: 40px 30px; text-align: center; background: linear-gradient(to right, #4f46e5, #7c3aed); border-radius: 8px 8px 0 0;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                                Đặt lại mật khẩu
                                            </h1>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                                                Xin chào <strong>${customer.fullname}</strong>,
                                            </p>
                                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                                                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Đây là mã xác thực của bạn:
                                            </p>
                                            
                                            <!-- OTP Box -->
                                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                                <tr>
                                                    <td align="center">
                                                        <div style="background-color: #f8f9fa; border: 2px dashed #4f46e5; border-radius: 8px; padding: 20px; display: inline-block;">
                                                            <span style="font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 8px;">
                                                                ${otp}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                                                Mã này sẽ hết hạn sau <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.
                                            </p>
                                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                                                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi nếu bạn có thắc mắc.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="text-align: center; padding-bottom: 20px;">
                                                        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                                            Đây là email tự động, vui lòng không trả lời email này.
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="text-align: center;">
                                                        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #666666;">
                                                            &copy; 2025 KTT Store. All rights reserved.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json({ 
            message: 'Mã OTP đã được gửi đến email của bạn',
            email: email // Trả về email để dùng cho bước tiếp theo
        })

    } catch (error) {
        console.error('Error in forgotPassword:', error)
        
        // Kiểm tra lỗi cụ thể từ nodemailer
        if (error.code === 'EAUTH') {
            return res.status(500).json({ 
                message: 'Lỗi xác thực email. Vui lòng kiểm tra lại cấu hình email.',
                error: error.message 
            })
        }
        
        // Các lỗi khác
        res.status(500).json({ 
            message: 'Có lỗi xảy ra khi gửi mã OTP',
            error: error.message 
        })
    }
}

// Xác thực OTP và đổi mật khẩu mới
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body

        // Kiểm tra OTP có tồn tại và còn hạn
        const storedOTPData = otpStore.get(email)
        if (!storedOTPData) {
            return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' })
        }

        if (storedOTPData.otp !== otp) {
            return res.status(400).json({ message: 'Mã OTP không chính xác' })
        }

        if (Date.now() > storedOTPData.expiry) {
            otpStore.delete(email)
            return res.status(400).json({ message: 'Mã OTP đã hết hạn' })
        }

        // Mã OTP hợp lệ, cập nhật mật khẩu
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await Customer.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        )

        // Xóa OTP đã sử dụng
        otpStore.delete(email)

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công' })

    } catch (error) {
        console.error('Error in resetPassword:', error)
        res.status(500).json({ 
            message: 'Có lỗi xảy ra khi đặt lại mật khẩu',
            error: error.message 
        })
    }
}

module.exports = {
    forgotPassword,
    resetPassword
}
