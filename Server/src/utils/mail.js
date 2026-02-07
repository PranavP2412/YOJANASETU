import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({
    path: ['.env.local', '.env'] 
});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

const mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "YojanaSetu",
        link: "https://yojanasetu-frontend-1.onrender.com"
    }
});

const sendEmail = async (options) => {
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const mail = {
        from: `YojanaSetu <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML
    };

    try {
        await transporter.sendMail(mail);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error("Email service failed:", error);
    }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to YojanaSetu! We are excited to have you on board.",
            action: {
                instruction: "To verify your email please click on the following button:",
                button: {
                    color: "rgb(35, 219, 115)",
                    text: "Verify Your Email",
                    link: verificationUrl
                }
            },
            outro: "Need help? Just reply to this email."
        }
    };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We received a request to reset the password for your account.",
            action: {
                instruction: "To reset your password, please click the button below:",
                button: {
                    color: "rgb(43, 206, 114)",
                    text: "Reset Password",
                    link: passwordResetUrl
                }
            },
            outro: "If you did not request a password reset, no further action is required."
        }
    };
};

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
};