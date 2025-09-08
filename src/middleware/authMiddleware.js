const requireAuth = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. An authentication token is required.',
    });
  }
  next();
};
module.exports = { requireAuth };