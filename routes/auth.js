// Add role-based authentication middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'Access denied. Admin privileges required.');
  return res.redirect('/dashboard');
};

const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    return next();
  }
  req.flash('error', 'Access denied. User privileges required.');
  return res.redirect('/dashboard');
};

// Export middleware
module.exports = {
  ensureAuthenticated,
  isAdmin,
  isUser
};