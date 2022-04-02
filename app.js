//require express modules
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const userPassport = require('./config/passport')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const PORT = process.env.PORT

//setting view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
//setting session
app.use(session({
  secret: 'process.env.SESSION_SECRET',
  resave: false,
  saveUninitialized: true
}))

//setting static files
app.use(express.static('public'))
//user body-parser urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//call passport function
userPassport(app)

app.use(flash())
//middleware for view
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()  
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') //設定success_msg訊息
  res.locals.warning_msg = req.flash('warning_msg') //設定warning_msg訊息
  next()
})

app.use(routes)


app.listen(PORT, () => {
  console.log(`Express is listening on http://localhost:${PORT}`)
})