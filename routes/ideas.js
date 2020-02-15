const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {ensureAuthenticated} = require('../helpers/auth')

//Requiring Model : Ideas 
require('../models/Ideas')
const Idea = mongoose.model('ideas')


// Ideas Routes

router.get('/add',ensureAuthenticated, function (req, res) {
    res.render('./ideas/add')
  })
  
  router.get('/edit/:id',ensureAuthenticated, function (req, res) {
    Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      if(idea.user != req.user.id) {
        req.flash('err_msg', 'Not Authorized')
        res.redirect('/ideas')
      } else {       
        res.render('ideas/edit', {
          idea: idea
        })
      }
    })
  })
  
  router.post('/',ensureAuthenticated, function(req, res) {
  
    let errors = []
  
    if(!req.body.title) {
      errors.push({text: 'Please enter title'})
    }
  
    if(!req.body.details) {
      errors.push({text : 'Please enter details'})
    }
  
    // if(!req.body.myImage) {
    //   errors.push({text: 'Please upload image'})
    // }
  
    if(errors.length > 0) {
      res.render('./ideas/add', {
        errors: errors,
        title: req.body.title,
        details: req.body.details
      })
  
    } else {
      let newUser = {
        title : req.body.title,
        details: req.body.details,
        user: req.user.id
      }
      new Idea(newUser)
        .save()
        .then(idea => {
          req.flash('success_msg', 'Idea has been added')
          res.redirect('/ideas')
        })
        .catch(err => {
          console.log(err)
        })
        console.log(newUser)
    }
  })
  
  router.get('/',ensureAuthenticated, function(req, res) {
    Idea.find({user: req.user.id})
     .sort({date: 'desc'})
     .then(ideas => {
       res.render('./ideas/index', {
         ideas:ideas
       })
     })
     .catch(err => {
       res.send(err)
     })
  })
  
  // Edit ideas :
  
router.put('/:id',ensureAuthenticated, function(req, res) {
    Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;
  
      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Video idea updated')
          res.redirect('/ideas')
        })
    })
  })
  
  // Delete idea route
  
  router.delete('/:id',ensureAuthenticated, (req, res) => {
    Idea.deleteOne({
      _id: req.params.id
    })
      .then(() => {
        req.flash('err_msg', 'Video idea removed')
        res.redirect('/ideas')
    })
  })
  
module.exports = router