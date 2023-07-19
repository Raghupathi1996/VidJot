const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {ensureAuthenticated} = require('../controller/auth')

//Load Idea model
require('../models/Idea')
const Idea = mongoose.model('Ideas')


router.get('/', ensureAuthenticated, async (req, res) => {
    await Idea.find({user: req.user.id})
    .lean()
    .sort({date:'desc'})
    .then(ideas => {
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
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add')
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .lean()
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized')
            res.redirect('/ideas')
        } else {
            res.render('ideas/edit', {
                idea:idea
            })
        }
    })
})

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
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
            details: req.body.details,
            user: req.user._id
        }
        new Idea(newUser)
          .save()
          .then(() => {
            req.flash('success_msg', 'Video idea added')
            res.redirect('/ideas')
          })
    }
})

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title
        idea.details = req.body.details

        idea.save()
            .then(() => {
                req.flash('success_msg', 'Video idea updated')
                res.redirect('/ideas')
            })
    })
})

// Delete Idea

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOneAndDelete({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video idea removed')
        res.redirect('/ideas');
    })
}) 

module.exports = router;