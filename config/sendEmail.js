require('dotenv').config()
const {Resend}  = require('resend')


if (!process.env.RESEND_API_KEYS) {
    console.log("Provide RESEND_API inside the .env file");
}

const resend = new Resend(process.env.RESEND_API_KEYS);

const sendEmail = async({sendTo, subject, html })=>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'DeshBd <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendEmail; // Export as CommonJS
