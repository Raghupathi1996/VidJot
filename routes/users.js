const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()

//Load Idea model
require('../models/User')
const User = mongoose.model('Users')

// User Login Route
router.get('/login', (req, res, next) => {
    res.render('users/login')
})

// User Registration Route
router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
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
            text:'Password must be atleast 4 characters'
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
        User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                req.flash('error_msg', 'Email already registred')
                res.redirect('/users/register')
            } else {
                const newRegister = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newRegister.password, salt, (err, hash) => {
                        if(err) throw err;
                        newRegister.password = hash
                        new User(newRegister)
                        .save()
                        .then(() => {
                            req.flash('success_msg', 'User Registered')
                            res.redirect('/users/login')
                        })
                    })
                });
            }
        })
    }
})

// Logout user

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) throw err
        req.flash('success_msg', 'You have Logged Out')
        res.redirect('/users/login')
    });
})

module.exports = router;