const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results
const User = require('../user')
const db = require('../../config/mongoose')

const SEED_USER = {
  name: 'admin',
  email: 'admin@example.com',
  password:'12345'
}

db.once('open', () => {
  User.findOne({ email: SEED_USER.email }).then(user => {
    if (user) {
      console.log('Seed已經執過。')
      process.exit()
    }
    bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    },))
    .then(user => {
      const userId = user._id
      return Promise.all(restaurantList.map((restaurant) => 
      Restaurant.create({
        name: restaurant.name,
        name_en: restaurant.name_en,
        category: restaurant.category,
        image: restaurant.image,
        location: restaurant.location,
        phone: restaurant.phone,
        google_map: restaurant.google_map,
        rating: restaurant.rating,
        description: restaurant.description,
        userId: userId
      })))
    })
    .then(() => {
      console.log('restaurantSeeder done!')
      process.exit()
    })
  })
})