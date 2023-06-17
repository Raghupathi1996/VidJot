require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const connectDB = require('./db/connect')

const app = express()
// console.log(exphbs) // contains ExpressHandlebars, create, and engine

//Load Idea model
require('./models/Idea')
const Idea = mongoose.model('Ideas')

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

app.get('/idea/add', (req,res) => {
     
})

const port = process.env.POR || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server started on port ${port}`)  //use of back tick or templete literal, to use string without have to concatinate
        })
    } catch (error) {
        console.log(error)
    }

}

start()