const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// render all restaurant
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(err => {
      console.log(err)
      res.render(
        'errorPage',
        { status: 500, error: err.message }
      )
    })
})

//Search Keyword
router.get('/search', (req, res) => {

  const keyword = req.query.keyword
  const keywordLowerCase = keyword.replace(/\s*/g, "").toLowerCase()

  Restaurant.find()
    .lean()
    .then(allRestaurant => {
      const filterRestaurant = allRestaurant.filter(
        restaurant =>
          restaurant.name.replace(/\s*/g, "").toLowerCase().includes(keywordLowerCase) ||
          restaurant.category.replace(/\s*/g, "").toLowerCase().includes(keywordLowerCase)
      )
      res.render('index', { restaurant: filterRestaurant, keyword: keyword })
    })
    .catch(err => {
      console.log(err)
      res.render(
        'errorPage',
        { status: 500, error: err.message }
      )
    })
})

module.exports = router