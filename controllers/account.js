/**
 * 账号控制器
 */
const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const utils = require('../utils')

// grt register
exports.register = (req, res) => {
  res.render('register')
}

// post register
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
  let currentUser
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

// get login
exports.login = (req, res) => {
  res.render('login')
}

// post login
exports.loginPost = (req, res) => {
  const { username, password, remember } = req.body
  if(! (username && password )) {
    return res.render('login',{ msg: '请填写完整表单' })
  }
  // let currentUser
  User.findOne( { where: {username} } )
    .then( user => {
      if(!user) throw new Error ('用户名不正确')
      // currentUser = user
      return bcrypt.compare(password, user.password)
    })
    .then(match => {
      if(!match) throw new Error('密码不正确')
      // req.session.currentUser = currentUser 
      res.redirect('/member')
    })
    .catch( e=>{
      return res.render('login', { msg: e.message })
    })
}
exports.active = (req, res) => {
  const {
    code
  } = req.query
  res.redirect( '/member' )
}
// get active
// exports.active = (req, res, next) => {
//   const { code } = req.query
//   // TODO:实现登陆   激活邮箱
//   User.findOne ({ where: { user_email_code: code } })
//     .then( user => {
//       // 已经取到当前验证码[匹配的用户,当前登陆用户信息在session中
//       // 判断是否是同一个用户  用id 
//       if ( user.user_id !== req.session.currentUser.user_id) {
//         //404 
//         const err = new Error('Not Found')
//         res.status = 404 
//         return next(err)
//       }
      
//       // 邮箱就是当前登陆用户的
//       user.is_active = '是'
      
//       // 邮件有时效性
//       // 已经激活成功了, code 失效
//       user.user_email_code = ''

//       // 通过再次保存用户信息 更新
//       return user.save()
//     })
//     .then ( user => {
//       // res.send('ok')
//       res.redirect( '/memember' )
//     })
// }
