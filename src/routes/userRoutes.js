const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { requireAuth } = require('../middleware/authMiddleware');

/**
 * Route: GET /currentUser/profile
 * Description: Aggregates user profile and addresses into one call.
 */
router.get('/currentUser/profile', requireAuth, async (req, res, next) => {
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
 * Route: POST /currentUser/addresses
 */
router.post('/currentUser/addresses', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const newAddress = await userService.addMyAddress(authToken, req.body);
    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    next(error);
  }
});

/**
 * Route: PUT /currentUser/addresses/:addressId
 */
router.put('/currentUser/addresses/:addressId', requireAuth, async (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        const updatedAddress = await userService.updateMyAddress(authToken, req.params.addressId, req.body);
        res.status(200).json({ success: true, data: updatedAddress });
    } catch (error) {
        next(error);
    }
});

/**
 * Route: DELETE /currentUser/addresses/:addressId
 */
router.delete('/currentUser/addresses/:addressId', requireAuth, async (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        const result = await userService.deleteMyAddress(authToken, req.params.addressId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
