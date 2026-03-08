const config = {
    saltRound: 10,
  secret: process.env.JWT_SECRET || 'thisismydseceret_forjwtsessionmanagement',
  otpExpireMinutes: Number(process.env.OTP_EXPIRE_MINUTES || 10),
  exposeOtpInResponse: process.env.EXPOSE_OTP_IN_RESPONSE === "true"
  }
  //later to be integrated with .env
  

module.exports = config
  