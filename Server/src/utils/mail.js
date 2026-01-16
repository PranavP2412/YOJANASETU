import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendEmail = async (options)=>{
    const mailGenerator = new Mailgen({
        theme:"default",
        product:{
            name:"YojanaSetu",
            link:"https://YojanaSetu.com"
        }
    })


    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHTML = mailGenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        
        }
    })

    const mail = {
        from: "pranavpatil69216@gmail.com",
        to:options.email,
        subject: options.subject,
        text:emailTextual,
        html: emailHTML
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Please Provide correct email address !");
        console.error("error",error)
    }
}


const emailVerificationMailgenContent = (username, verificationUrl)=>{
    return {
        body:{
            name:username,
            intro:"Welcome to our YOJANASETU app. We are excited to have you on board.",
            action:{
                instruction:"To verify your email please click on the following button!",
                button:{
                    color:"rgb(35, 219, 115)",
                    text:"verify your email",
                    link: verificationUrl
                }
            },
            outro:"Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

const forgotPasswordMailgenContent = (username, passwordResetUrl)=>{
    return {
        body:{
            name:username,
            intro:"We got a request to reset the password of your account.",
            action:{
                instruction:"To reset your Password please click on the following button!",
                button:{
                    color:"rgb(43, 206, 114)",
                    text:"Reset Password",
                    link: passwordResetUrl
                }
            },
            outro:"Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}