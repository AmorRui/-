/**
 * 账号控制器
 */
exports.login = (req, res) => {
  res.send('login')
}

exports.register = (req, res) => {
  res.render('register')
}

exports.registerPost = (req, res) => {
  const { username, email, password,confirm,agree} = req.body
  // 表单不能为空
  if (!(username && email && password && confirm)) {
    // throw new Error('请完整填写注册表单')
    return res.render('register', { msg: '请完整填写注册表单' })
  }
  // 密码是否一致
  if (password !== confirm) {
    return res.render('register', { msg: '输入密码不一致' })
  }
  // 必须同意协议
  if (agree !== 'on') {
    return res.render('register', { msg: '请同意协议' })
  }
  // 验证用户名字时候存在
}