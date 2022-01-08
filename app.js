//require express modules
const express = require('express')
const app = express()
const port = 3000

//require express-handlebars
const exphbs = require('express-handlebars')

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))