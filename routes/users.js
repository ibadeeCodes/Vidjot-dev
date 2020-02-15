const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')


//Requiring Model : User 
require('../models/User')
const User = mongoose.model('users')

router.get('/login', (req,res) => {
    res.render('users/login')
})

router.get('/register', (req,res) => {
    res.render('users/register')
})

router.post('/register', (req,res) => {
    // res.render('users/register')
    let errors = []

    if(req.body.password !== req.body.password2) {
        errors.push({text : 'Passwords didn\'t matched'})
    }

    if(req.body.password.length < 3) {
        errors.push({text : 'Password is weak'})
    }

    if(errors.length > 0) {
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
            if(user) {
                req.flash('err_msg', 'Email already exist')
                res.redirect('/users/login')
            } else {
                let newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
        
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password,salt,(err, hash) => {
                        if(err) throw err;
                        newUser.password = hash
                        newUser.save()
                        .then(user => {
                            req.flash('succes_msg', 'Account has been registered. Now you can login')
                            res.render('./users/login')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    })
                })
                
            }
        })
    }
})

router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)
})

router.get('/logout', (req,res) => {
    req.logOut()
    req.flash('success_msg', 'Logout Successfully')
    res.redirect('/users/login')
})

module.exports = router