const nodeMailer = require("nodemailer");

type Props = {
  email: string;
  subject: string;
  message: string;
  html: string;
};

const sendEmail = async (options: Props) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${process.env.APPNAME}" <${process.env.SMTP_MAIL}>`,
    to: options.email || `${process.env.APPNAME} Admin`, // list of recipients
    subject: `New ${options.subject}`, // Subject line
    message: options.message, // plain text body
    html: `<b>${options.html}</b>`, // HTML body content
    // attachments: [{ filename: "report.pdf", path: "/path/to/file" }],
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
