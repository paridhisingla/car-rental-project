const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Register process
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    
    // Validation
    let errors = [];
    
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please fill in all fields' });
    }
    
    if (password !== password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      errors.push({ msg: 'Password should be at least 6 characters' });
    }
    
    if (errors.length > 0) {
      return res.render('auth/register', {
        errors,
        name,
        email
      });
    }
    
    // Check if email exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      errors.push({ msg: 'Email is already registered' });
      return res.render('auth/register', {
        errors,
        name,
        email
      });
    }
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password
    });
    
    await newUser.save();
    
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Login process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
  });
});

module.exports = router;

