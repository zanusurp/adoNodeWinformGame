var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

//home
router.get('/',function(req,res){
    res.render('home/welcome');
});
router.get('/about',function(req,res){
    res.render('home/about');
});

//login
router.get('/login', function(req, res){
    //console.log(req.flash('username'));//사용자 확인 디버그 
    var username = req.flash('username')[0];
    var errors = req.flash('errors')[0] || {};
    res.render('home/login', {
        username: username,
        errors:errors
    });
});

//post Login
router.post('/login',
  function(req,res,next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/posts',
    failureRedirect : '/login'
  }
));

router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
