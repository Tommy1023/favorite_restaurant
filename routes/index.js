//express
const express = require('express')
//routers
const router = express.Router()
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')
//middleware
const { authenticator } = require('../middleware/auth')

router.use('/restaurants',authenticator, restaurants)
router.use('/users', users)
router.use('/auth', auth) 
router.use('/',authenticator, home)

module.exports = router