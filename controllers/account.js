/**
 * 账号控制器
 */
const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const utils = require('../utils')

// GET register
exports.register = (req, res) => {
  res.render('register')
}
// POST registerPost
exports.registerPost = (req, res) => {
  const { username, email, password, confirm, agree} = req.body
  // 表单不能为空
  if (!(username && email && password && confirm)) {
    throw new Error('请完整填写注册表单')
  }
  // 密码是否一致
  if (password !== confirm) {
    throw new Error('输入密码不一致')
  }
  // 必须同意协议
  if (!agree) {
    throw new Error('请同意协议')
  }
  // 判断用户时候存在
  User.findOne({ where: { username } })
    .then(user => {
      if (user) throw new Error('用户名已经存在')
      return User.findOne({ where: { user_email: email } })
    })
    .then(user => {
      if (user) throw new Error('邮箱已经存在')
      // 持久化
      const newUser = new User()
      newUser.username = username
      // code截取
      newUser.user_email = email
      newUser.user_email_code = uuid().substr(0,10)
      // 密码加密
      const salt = bcrypt.genSaltSync(10)
      newUser.password = bcrypt.hashSync(password, salt)

      newUser.create_time = Date.now() / 1000
      newUser.update_time = Date.now() / 1000
      return newUser.save()
    })
    .then(user => {
    // user => 新建过后的用户信息(包含ID和那些默认值)
      // console.log(user)
      if (!user.user_id) throw new Error('注册失败')
      // 发送激活邮件
      const activeLink = `http:127.0.0.1:3000/active?code=${user.user_email_code}`  
      utils.sendEmail(email, '请激活您的邮箱(模拟京东)', `<p><a href= :"${activeLink}">${activeLink}</p>`)
        .then(() => {
          res.redirect('/login')
        })
    })
    .catch(e => {
      res.render('register', { msg: e.message })
    })
}

// GET login
exports.login = (req, res) => {
  res.render('login')
}

// POST loginPost
exports.loginPost = (req, res, nex) => {
  // 提交的东西要先进行解构 
  const { username, password, remember} = req.body
  // 界面级别校验   外界来的数据合理不合理
  if(!(username && password)) {
    return res.render('login',{ msg: '请完整填写登陆信息' })
  // 业务级别的校验  查询数据库内容
    User.findOne( { where: {username} } )
      .then( user => {
        if( !user ) throw new Error('用户名不存在')
        // 判断密码是否匹配
        // 密码都是加密的,不能直接全等,需要进行再次加密
        return bcrypt.compare( password, user.password )
      })
    .then( match => {
      if( !match ) throw new Error('密码错误')
          // 用户存在  且密码正确
        res.send('登陆成功')
    })

    .catch(e => {
      return res.render('login',{ msg: e.message })
    })
  }
}

exports.active = (req,res) => {
  const { code } = req.query
  res.send(code)
}
