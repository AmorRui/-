const { Router } = require('express')

const router = new Router()

const home = require('./controllers/home')
const accountController = require('./controllers/account')
const commonController = require('./controllers/common')

router.get('/', home)

router.get('/register', accountController.register)
router.post('/register', accountController.registerPost)
router.get('/login', accountController.login)
router.post('/login', accountController.loginPost)
router.get('/active', accountController.active)

router.get('/captcha', commonController.captcha)


module.exports = router
