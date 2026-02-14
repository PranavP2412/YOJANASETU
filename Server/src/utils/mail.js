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
    // Generate content
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const mail = {
        from: `YojanaSetu <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: emailHTML
    };

    try {
        // VERIFY transporter first to check connection
        await transporter.verify(); 
        
        const info = await transporter.sendMail(mail);
        console.log("Email sent! Message ID:", info.messageId);
        return info;
    } catch (error) {
        // Log the SPECIFIC SMTP error code
        console.error("SMTP Error Details:", error.code, error.command, error.response);
        throw error; // Throw so controller knows it failed
    }
};

const emailVerificationMailgenContent = (FullName, verificationUrl) => {
    return {
        body: {
            name: FullName,
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

const forgotPasswordMailgenContent = (FullName, passwordResetUrl) => {
    return {
        body: {
            name: FullName,
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