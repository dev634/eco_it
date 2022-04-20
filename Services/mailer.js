const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

async function sendPassword(email, password) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: process.env.SMPT_SUBJECT,
      html: `<h1>${process.env.SMTP_TITLE}</h1>\n
            <p>Voici votre nouveau mot de passe ${password}`,
    });
  } catch (error) {
    return {
      status: 500,
      message: "internal Error",
    };
  }
}

module.exports = {
  sendPassword,
};
