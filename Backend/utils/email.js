const nodemailer = require("nodemailer")

const createTransport = () => {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error("Missing SMTP config. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env")
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

const sendOtpEmail = async ({ to, otp, purpose }) => {
  const transporter = createTransport()
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER

  const subject = purpose ? `TaxPal OTP - ${purpose}` : "TaxPal OTP"
  const text = `Your TaxPal verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  })
}

module.exports = { sendOtpEmail }
