require('dotenv').config()
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')  // server side rendering 
const methodOverride = require('method-override')  // HTML does not support put and delete 
const bodyParser = require('body-parser')  // parse the object from the mongoDB or from front end
const flash = require('connect-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const connectDB = require('./db/connect')
const notFound = require('./middleware/not-found')
const mainRoute = require('./routes/vidjot')

const app = express()

// Load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')


// console.log(exphbs) // contains ExpressHandlebars, create, and engine

// // Json parser
// app.use(express.json())

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Method override middleware
app.use(methodOverride('_method'))

// Express session middleware
app.use(session({
    secret: 'secret', // the key used to read and write in to cookies 
    resave: true, // forces the session to be stored back to the session store
    saveUninitialized: true // forces the session that is unintialized to be saved in the storage
}))

app.use(flash())

app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})


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

app.use('/ideas', ideas)
app.use('/users', users)


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