const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
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
  const errors = []
  if ( !email || !password || !confirmPassword ) {
    errors.push({ message: 'Email、password、confirmPassword為必填欄位!' })
  }
  if ( password !== confirmPassword ) {
    errors.push({ message: '密碼與確認密碼不符!' })
  }
  if ( errors.length ) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email }).then(user => {
      if (user) { 
        errors.push({ message: '這個 Email 已被註冊過!' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.logout()
        res.redirect('/users/login')
      })
      .catch(err => {
        console.log(err)
        res.render(
          'errorPage',
          { status: 500, error: err.message }
        )
      })
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
  failureRedirect: '/users/login', 
  failureFlash: true   //將驗證錯誤以flash訊息顯示
  })
)

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出!')
  res.redirect('/users/login')
})

module.exports = router