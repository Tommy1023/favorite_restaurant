const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// render all restaurant & search
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .then(restaurants => {
      const keyword = req.query.keyword
      
      if (!keyword) {
        res.render('index', { restaurant: restaurants})
      }else {
        const keywordLowerCase = keyword.replace(/\s*/g, "").toLowerCase()
        const filterRestaurant = restaurants.filter(
          restaurant =>
            restaurant.name.replace(/\s*/g, "").toLowerCase().includes(keywordLowerCase) ||
            restaurant.category.replace(/\s*/g, "").toLowerCase().includes(keywordLowerCase)
        )
        res.render('index', { restaurant: filterRestaurant, keyword: keyword })
      }
    })
    .catch(err => {
      console.log(err)
      res.render(
        'errorPage',
        { status: 500, error: err.message }
      )
    })
})

// sort function
router.get('/sort/:sort', (req, res) => {
  const sort = req.params.sort
  const userId = req.user._id
  Restaurant.find({userId})
    .lean()
    .sort(sort)
    .then(restaurants => {
      res.render('index', {restaurant: restaurants})
    })
})

module.exports = router