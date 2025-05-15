const express = require('express');
const router = express.Router();

// Admin dashboard
router.get('/', (req, res) => {
  res.render('admin/dashboard', { title: 'Admin Dashboard' });
});

// Manage cars
router.get('/cars', (req, res) => {
  res.render('admin/cars', { title: 'Manage Cars' });
});

// Manage bookings
router.get('/bookings', (req, res) => {
  res.render('admin/bookings', { title: 'Manage Bookings' });
});

// Manage users
router.get('/users', (req, res) => {
  res.render('admin/users', { title: 'Manage Users' });
});

module.exports = router;
