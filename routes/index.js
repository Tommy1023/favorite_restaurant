const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const users = require('./modules/users')
const restaurants = require('./modules/restaurants')

router.use('/restaurants', restaurants)
router.use('/users', users)
router.use('/', home)

module.exports = router