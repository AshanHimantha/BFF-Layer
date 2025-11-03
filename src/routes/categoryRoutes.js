const express = require('express');
const router = express.Router();
const multer = require('multer');
const categoryService = require('../services/categoryService');
const { requireAuth } = require('../middleware/authMiddleware');

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/categories - Get all categories with pagination
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const page = req.query.page || 0;
    const size = req.query.size || 20;
    const sort = req.query.sort;

    const result = await categoryService.getAllCategories(authToken, page, size, sort);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:categoryId - Get category by ID
router.get('/:categoryId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const category = await categoryService.getCategoryById(authToken, req.params.categoryId);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

// POST /api/categories - Create new category (SuperAdmins only)
router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const createdCategory = await categoryService.createCategory(authToken, req.body, req.file);
    res.status(201).json({ success: true, data: createdCategory });
  } catch (error) {
    next(error);
  }
});

// PUT /api/categories/:categoryId - Update category (SuperAdmins only)
router.put('/:categoryId', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const updatedCategory = await categoryService.updateCategory(authToken, req.params.categoryId, req.body, req.file);
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:categoryId - Delete category
router.delete('/:categoryId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    await categoryService.deleteCategory(authToken, req.params.categoryId);
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

