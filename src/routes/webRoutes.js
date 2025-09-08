const express = require('express');
const router = express.Router();
const userService = require('../components/userService');
const { requireAuth } = require('../middleware/authMiddleware');

const WEB_API_PREFIX = '/api';

// --- PUBLIC ROUTES (Example) ---
// This route is not protected and can be accessed by anyone.
router.get(`${WEB_API_PREFIX}/status`, (req, res) => {
    res.status(200).json({ status: 'BFF is running' });
});

// --- PRIVATE (PROTECTED) ROUTES ---
// All routes below require a valid Authorization header.

/**
 * Route: GET /api/currentUser/profile
 * Description: Aggregates user profile and addresses into one call.
 */
router.get(`${WEB_API_PREFIX}/currentUser/profile`, requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    
    const profilePromise = userService.getCurrentUser(authToken);
    const addressesPromise = userService.getMyAddresses(authToken);

    const [profile, addresses] = await Promise.all([profilePromise, addressesPromise]);
    
    const aggregatedData = { ...profile, addresses: addresses || [] };
    res.status(200).json({ success: true, data: aggregatedData });
  } catch (error) {
    next(error);
  }
});

/**
 * Route: POST /api/currentUser/addresses
 */
router.post(`${WEB_API_PREFIX}/currentUser/addresses`, requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const newAddress = await userService.addMyAddress(authToken, req.body);
    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    next(error);
  }
});

/**
 * Route: PUT /api/currentUser/addresses/:addressId
 */
router.put(`${WEB_API_PREFIX}/currentUser/addresses/:addressId`, requireAuth, async (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        const updatedAddress = await userService.updateMyAddress(authToken, req.params.addressId, req.body);
        res.status(200).json({ success: true, data: updatedAddress });
    } catch (error) {
        next(error);
    }
});

/**
 * Route: DELETE /api/currentUser/addresses/:addressId
 */
router.delete(`${WEB_API_PREFIX}/currentUser/addresses/:addressId`, requireAuth, async (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        const result = await userService.deleteMyAddress(authToken, req.params.addressId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;