const { Router } = require('express')

const router = new Router()

const home = require('./controllers/home')
const accountController = require('./controllers/account')

router.get('/register', accountController.register)
router.post('/register', accountController.registerPost)
router.get('/login', accountController.login)

router.get('/', home)

module.exports = router
