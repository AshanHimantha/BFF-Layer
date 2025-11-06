const express = require('express');
const router = express.Router();
const categoryTypeService = require('../services/categoryTypeService');
const { requireAuth } = require('../middleware/authMiddleware');

// GET /api/v1/category-types - Get all category types with pagination
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const page = req.query.page || 0;
    const size = req.query.size || 20;
    const sort = req.query.sort;

    const result = await categoryTypeService.getAllCategoryTypes(authToken, page, size, sort);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/category-types/:categoryTypeId - Get category type by ID
router.get('/:categoryTypeId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const categoryType = await categoryTypeService.getCategoryTypeById(authToken, req.params.categoryTypeId);
    res.status(200).json({ success: true, data: categoryType });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/category-types - Create new category type (SuperAdmins only)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const createdCategoryType = await categoryTypeService.createCategoryType(authToken, req.body);
    res.status(201).json({ success: true, data: createdCategoryType });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/category-types/:categoryTypeId - Update category type (SuperAdmins only)
router.put('/:categoryTypeId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const updatedCategoryType = await categoryTypeService.updateCategoryType(authToken, req.params.categoryTypeId, req.body);
    res.status(200).json({ success: true, data: updatedCategoryType });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/category-types/:categoryTypeId - Partially update category type (e.g., status only)
router.patch('/:categoryTypeId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const patchedCategoryType = await categoryTypeService.patchCategoryType(authToken, req.params.categoryTypeId, req.body);
    res.status(200).json({ success: true, data: patchedCategoryType });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/category-types/:categoryTypeId/status - Update category type status
router.patch('/:categoryTypeId/status', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    
    const patchedCategoryType = await categoryTypeService.patchCategoryType(authToken, req.params.categoryTypeId, { status });
    res.status(200).json({ success: true, data: patchedCategoryType });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/category-types/:categoryTypeId - Delete category type
router.delete('/:categoryTypeId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    await categoryTypeService.deleteCategoryType(authToken, req.params.categoryTypeId);
    res.status(200).json({ success: true, message: 'Category type deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
