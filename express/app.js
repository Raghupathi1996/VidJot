require('dotenv').config()
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')  // server side rendering 
const methodOverride = require('method-override')  // HTML does not support put and delete 
const bodyParser = require('body-parser')  // parse the object from the mongoDB or from front end
const flash = require('connect-flash') // pass flash messages
const session = require('express-session') // to track the sessions of the window
const passport = require('passport')
const mongoose = require('mongoose')
const connectDB = require('./db/connect')
const notFound = require('./middleware/not-found')
const mainRoute = require('./routes/vidjot')

const app = express()

// Load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Passport Config
require('./config/passport')(passport)

//DB Config
const db = require('./config/database')

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
    secret: 'secret', // This option specifies the secret used to sign the session cookie. It should be a random string that is unique to your application
    resave: true, // This option indicates whether the session should be saved even if no modifications have been made to it.
    saveUninitialized: true // This option determines whether a session should be saved if it is uninitialized
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
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

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(db.mongoURI)
        app.listen(port, () => {
            console.log(`Server started on port ${port}`)  //use of back tick or templete literal, to use string without have to concatinate
        })
    } catch (error) {
        console.log(error)
    }
    
}

start()