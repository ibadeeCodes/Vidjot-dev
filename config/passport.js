const express = require('express')
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = mongoose.model('users')

module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email,password,done) => {
        User.findOne({
            email: email
        })
        .then(user => {
            if(!user) {
                return done(null, false, {message: 'User not found'})
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) console.log(err) //some external err
                if(isMatch) { //if passwords matched
                    return done(null, user)
                }
                else {
                    return done(null, false, {message: 'Password is incorrect'}) 
                }
            })
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}


