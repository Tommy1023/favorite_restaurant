//require express modules
const express = require('express')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser') 


const app = express()
const port = 3000


//connect mongodb
mongoose.connect('mongodb://localhost/restaurantList') 

// set mongodb
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})
//setting view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
//setting static files
app.use(express.static('public'))
//user body-parser urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// render all restaurant
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

//restaurant details
app.get('/restaurants/:id', (req, res) => {
    Restaurant.findById(req.params.id)
      .lean()
      .then(restaurant => res.render('show', { restaurant: restaurant }))
      .catch(error => console.log(error))
})

//Add new restaurant page
app.get("/restaurant/new", (req, res) => {
  res.render("new")
})

//Add restaurant
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Edit restaurant
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

//save restaurant
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
    Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//delete restaurant
app.get('/restaurants/:id/delete', (req, res) => {
  Restaurant.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// //Search Keyword
app.get('/search', (req, res) => {

  const keyword = req.query.keyword
  const keywordLowerCase = keyword.replace(/\s*/g, "").toLowerCase()

  Restaurant.find()
    .lean()
    .then(allRestaurant => {
      const filterRestaurant =  allRestaurant.filter(
        restaurant => 
          restaurant.name.replace(/\s*/g, "").toLowerCase().includes(keywordLowerCase) || 
          restaurant.category.replace(/\s*/g, "").toLowerCase().includes(keywordLowerCase)
      )
      res.render('index',{restaurant: filterRestaurant, keyword: keyword})
    })
    .catch(error => console.log(error))
})


app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})