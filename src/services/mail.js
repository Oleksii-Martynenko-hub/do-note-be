const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, API_URL } = process.env
class MailService {
    
    constructor() {
        this.transport = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD,
            },
        })
    }

    async sendConfirmMail(to, link) {
        const send = await this.transport.sendMail({
            from: SMTP_USER,
            to,
            subject: `Account confirmation  for ${API_URL}!`,
            text: '',
            html: `
                <div style="background: #eff; border-radius: 6px; border: 1px solid #ededed; padding: 20px 40px;">
                    <h1>Confirm your account</h1>

                    <p>Please click the <a href="${API_URL}/confirm/${link}">link</a> for that.</p>
                    <span><a href="${API_URL}/confirm/${link}">${API_URL}/confirm/${link}</a></span>
                    
                    <p>Thank you!</p>
                </div>
            `
        })
        console.log(send);
    }
}

module.exports = new MailService();