const express = require('express')
const exphbs = require('express-handlebars')


const app = express()
// console.log(exphbs) // contains ExpressHandlebars, create, and engine

// Handlebars Middleware
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// How middleware works
// app.use(function(req,res,next){
//     req.name = 'Raghupathi'
//     console.log(Date.now())
//     next()
// })

app.get('/', (req, res) => {
    const title = 'Welcome'
    // console.log(req.name)
    // res.send(`Hi, Welcome ${req.name}`)
    res.render('index', {
        title: title
    })

})

app.get('/about', (req,res) => {
    res.render('about')
})

const port = 5000
app.listen(port, () => {
    console.log(`Server started on port ${port}`)  //use of back tick or templete literal, to use string without have to concatinate
})