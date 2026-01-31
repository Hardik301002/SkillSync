const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    console.log("Attempting to send email as:", process.env.SMTP_USER);
    
    // 1. Create the transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // 2. Define email options
    const mailOptions = {
        from: `"SkillSync Team" <${process.env.SMTP_USER}>`, // Sender address
        to: options.email, // Receiver address
        subject: options.subject, // Subject line
        html: options.message // HTML body
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;