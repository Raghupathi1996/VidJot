const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

//Load Idea model
require('../models/User')
const User = mongoose.model('Users')

// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login')
})

// User Registration Route
router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({
            text:'Password do not match'
        })
    }

    if(req.body.password.length < 4){
        errors.push({
            error:'Password must be atleast 4 characters'
        })
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        const newRegister = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        new User(newRegister)
        .save()
        .then(() => {
            req.flash('success_msg', 'User Registered')
            res.redirect('/users/login')
        })

    }
})


module.exports = router;