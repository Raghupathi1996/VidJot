require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const connectDB = require('./db/connect')
const notFound = require('./middleware/not-found')
const mainRoute = require('./routes/vidjot')

const app = express()

// console.log(exphbs) // contains ExpressHandlebars, create, and engine

// // Json parser
// app.use(express.json())

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'))

//Load Idea model
require('./models/Idea')
const Idea = mongoose.model('Ideas')

// Handlebars Middleware
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use('/vidjot', mainRoute)
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

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/ideas', async (req, res) => {
    await Idea.find({})
    .lean()
    .sort({date:'desc'})
    .then(ideas => {
        // console.log(ideas)
        res.render('ideas/index', {
            ideas:ideas
        })
    }) 
    // with .lean() it returns a plain javascript object
    // you lose some of the benefits provided by Mongoose, such as schema validation and middleware hooks
    
    
    // await Idea.find({})
    // .sort({date:'desc'})
    // .then(ideas => {
    //     console.log(ideas)
    // })
})

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
})

app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .lean()
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        })
    })
})

// Process Form
app.post('/ideas', (req, res) => {
    let errors = [];
    
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }
    
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
          .save()
          .then(idea => {
            res.redirect('/ideas')
          })
    }
})

// Edit form process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title
        idea.details = req.body.details

        idea.save()
            .then(() => {
                res.redirect('/ideas')
            })
    })
})
app.use(notFound)

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