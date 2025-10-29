const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { requireAuth } = require('../middleware/authMiddleware');


router.get('/search', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const email = req.query.email;
    const users = await userService.searchUsersByEmail(authToken, email);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// GET /api/users?limit=20&nextToken=...
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const limit = req.query.limit || 20;
    const nextToken = req.query.nextToken;

    const result = await userService.getAllUsers(authToken, limit, nextToken);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:userId
router.get('/:userId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const user = await userService.getUserById(authToken, req.params.userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/users  (create admin user)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const created = await userService.createAdminUser(authToken, req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/users/:userId/role
router.put('/:userId/role', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const rolesBody = req.body; // expecting { roles: ["ROLE1","ROLE2"] }
    await userService.updateUserRoles(authToken, req.params.userId, rolesBody);
    res.status(200).json({ success: true, message: 'User roles updated successfully' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/users/:userId/status
router.put('/:userId/status', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const { enabled } = req.body;
    await userService.updateUserStatus(authToken, req.params.userId, enabled);
    res.status(200).json({ success: true, message: `User status updated` });
  } catch (error) {
    next(error);
  }
});

// ------------------ CURRENT USER ROUTES ------------------

// GET /api/v1/users/currentUser
router.get('/currentUser', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const profile = await userService.getCurrentUser(authToken);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/users/currentUser/addresses
router.get('/currentUser/addresses', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const addresses = await userService.getMyAddresses(authToken);
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/users/currentUser/addresses
router.post('/currentUser/addresses', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const newAddress = await userService.addMyAddress(authToken, req.body);
    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/users/currentUser/addresses/:addressId
router.put('/currentUser/addresses/:addressId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const updatedAddress = await userService.updateMyAddress(authToken, req.params.addressId, req.body);
    res.status(200).json({ success: true, data: updatedAddress });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/users/currentUser/addresses/:addressId
router.delete('/currentUser/addresses/:addressId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const result = await userService.deleteMyAddress(authToken, req.params.addressId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
