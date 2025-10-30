const express = require('express');
const router = express.Router();

const API_PREFIX = '/api';

// Import route modules
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
// const productRoutes = require('./productRoutes');
// const orderRoutes = require('./orderRoutes');

// --- PUBLIC ROUTES ---
router.get(`${API_PREFIX}/status`, (req, res) => {
    res.status(200).json({ status: 'BFF is running', api: API_PREFIX });
});

// --- PROTECTED ROUTES ---
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/categories`, categoryRoutes);
// router.use(`${API_PREFIX}/products`, productRoutes);
// router.use(`${API_PREFIX}/orders`, orderRoutes);

module.exports = router;
