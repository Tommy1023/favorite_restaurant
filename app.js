const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('My Favorite restaurant')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})