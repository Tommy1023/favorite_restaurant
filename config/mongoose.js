const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI
//connect mongodb
mongoose.connect(MONGODB_URI)

// set mongodb
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db