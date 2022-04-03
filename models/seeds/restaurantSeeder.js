const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results
const User = require('../user')
const db = require('../../config/mongoose')
const restaurant = require('../restaurant')

const SEED_USERS = [
  {
    email: 'user1@example.com',
    password:'12345678' ,
    restaurant: restaurantList.slice(0, 3) 
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    restaurant: restaurantList.slice(3, 6) 
  }
]

db.once('open', () => {
  //利用Promise.all加array.from建立兩筆user data
  Promise.all(Array.from(SEED_USERS, seedUser => {
    return bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(seedUser.password, salt))
    .then(hash =>  User.create({
      email: seedUser.email,
      password: hash,
    }))
    //建立user後便可以取得userId，再利用forEach把userId加入餐廳資料進行關聯
    .then(user => {
      const userId = user._id
      seedUser.restaurant.forEach(restaurant => {
        restaurant.userId = userId        
      })
      //建立加入userId後的餐廳資料
      return Restaurant.create(seedUser.restaurant)
    })
  }))
    .then(() => {
    console.log('restaurantSeeder done!')
    process.exit()
  })
  .catch(err => console.log(err))
})
