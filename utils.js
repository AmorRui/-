const nodemailer = require('nodemailer')

const config = require('./config')

const transporter = nodemailer.createTransport(config.mail)
/**
 * 
 * @param {*} to 收件人,可以是字符串
 * @param {*} subject 邮箱标题
 * @param {*} content 邮箱内容,可以包含HTML
 */
exports.sendEmail = (to, subject, content) =>{
  const message = {
    from: `"${config.mail.name}" <${config.mail.auth.user}>`,
    to: to,
    subject: subject,
    html: content
  }
  return transporter.sendMail(message)
}
