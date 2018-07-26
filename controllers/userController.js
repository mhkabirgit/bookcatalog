const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var bcrypt = require('bcrypt');
var session = require('express-session');

var User = require('../models/user');

module.exports.create_user_get = function (req, res, next) {
  res.render('signup_form', {title: 'Sign Up'});
};

module.exports.create_user_post = [

  body('email', 'Email must not be empty').isLength({min:1}).trim(),
  body('username', 'Username must not be empty').isLength({min:1}).trim(),
  body('password', 'Password must not be empty').isLength({min:1}).trim(),
  body('passwordcnf', 'Password confirmation must not be empty').isLength({min:1}).trim(),

  sanitizeBody('username').trim().escape(),

  (req, res, next) => {
    var user = new User ({
      email: req.body.email,
      username:req.body.username,
      password: req.body.password,
      passwordcnf: req.body.passwordcnf
    });
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('signup_form', {title:'Sign Up', user:user, errors:errors.array()});
      return;
    }
    User.findOne({email:req.body.email})
    .exec(function(err, found_user) {
      if(err) {
        return next(err);
      }
      if(found_user) {
        res.render('signup_form', {title: 'Sign Up', user: user, error: 'A username with this email address already exists.'});
        return;
      }
    });

    User.findOne({username:req.body.username})
    .exec(function(err, found_user) {
      if(err) {
        return next(err);
      }
      if(found_user) {
        var error = new Error();
        res.render('signup_form', {title: 'Sign Up', user: user, error: 'This username already exists.'});
        return;
      }
    });

    if(req.body.password !== req.body.passwordcnf) {
      res.render('signup_form', {title: 'Sign Up', user: user, error:'Password and Password Confirmation did not match.' });
      return;
    }

    //Tried to create user with UserSchema pre hook to hash password before saving, didn't work
    //It is saving password into the database in plain text, which is unacceptable
    // User.create(user, function (err) {
    //   if(err) {
    //     return next(err);
    //   }
    //   res.render('user_profile', {title: 'Sign Up Successful', user:user});
    // });

    bcrypt.hash(req.body.password, 10, function(err, hash) {
      if(err) {
        return next(err);
      }
      User.create({email:req.body.email, username: req.body.username, password: hash, passwordcnf: hash}, function (err) {
        if(err) {
          return next(err);
        }
        res.render('user_profile', {title: 'Sign Up Successful', user:user});
      });
    });
  }

];

module.exports.signin_get = function(req, res,next) {
  res.render('signin_form', {title: 'Sign In'});
};

module.exports.signin_post = function(req, res, next) {
  if(req.body.email && req.body.password) {
    sanitizeBody('email').trim();
    sanitizeBody('password').trim();
    User.authenticate(req.body.email, req.body.password, function(err, user) {
      if(err || !user) {
        res.render('signin_form', {title: 'Sign In', email: req.body.email, error: 'Wrong email or password.'});
      }
      else {
        req.session.user=user;
        res.redirect('/catalog');
      }
    });
  }
  else {
    res.render('signin_form', {title: 'Sign In', email: req.body.email, error: 'Email and password are required.'});
  }
};

module.exports.signout_get = function (req, res, next) {
  if(req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    //Tried to render sign in page with customise info, it did not work, fails to sign in
    // res.render('signin_form', {title: 'Successfully signed out, Sign in again?', email: req.body.email});
    res.redirect('/users/signin');
  }
  else {
    //Tried to render sign in page with customise info, it did not work, fails to sign in
    // res.render('signin_form', {title: 'Not signed, Sign in?', email: req.body.email});
    res.redirect('/users/signin');
  }
};
