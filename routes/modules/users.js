const express = require('express')
const passport = require('passport')
const { rawListeners } = require('../../models/user')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email }).then(user => {
      if (user) { 
        console.log('This Email is exists')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      }
      return User.create({
        name,
        email,
        password
      })
    })
    .then(() => {
      req.logout()
      res.redirect('/users/login')})
    .catch(err => {
      console.log(err)
      res.render(
        'errorPage',
        { status: 500, error: err.message }
      )
    })
    .catch(err => {
      console.log(err)
      res.render(
        'errorPage',
        { status: 500, error: err.message }
      )
    })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router