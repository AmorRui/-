const captcha = require('svg-captcha')

exports.captcha = (req, res) => {
  const svg = captcha.create()
  // 生成验证码的时候,将验证码的内容放到当前用户的session中
  req.session.captcha = svg.test
  res.type('svg')
  res.send(svg.data)
}