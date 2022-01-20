const mongoose = require('mongoose')

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

module.exports = db