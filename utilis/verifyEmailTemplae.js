const verifyEmailTemplate = ({ name,otp }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Dear ${name},</p>
        <p>Thank you for registering with DeshBd Grocery Market Shop. Please verify your email by OTP</p>
        <p>Your OTP : ${otp}</p>

         

        <p>If you didn’t request this, please ignore this email.</p>
        <p>Best regards,</p>
        <p><strong>DashBd Team</strong></p>
        <p><strong>Maharun Nesa Puspo</strong></p>
        <p><strong>Admin</strong></p>
    </body>
    </html>
    `;
};

module.exports = verifyEmailTemplate;
