const express = require('express');
const router = express.Router();
const productVariantService = require('../services/productVariantService');
const { requireAuth } = require('../middleware/authMiddleware');

// GET /api/product-variants/product/:productId - Get all variants for a product
router.get('/product/:productId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const variants = await productVariantService.getVariantsByProductId(authToken, req.params.productId);
    res.status(200).json({ success: true, data: variants });
  } catch (error) {
    next(error);
  }
});

// GET /api/product-variants/:variantId - Get variant by ID
router.get('/:variantId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const variant = await productVariantService.getVariantById(authToken, req.params.variantId);
    res.status(200).json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
});

// POST /api/product-variants/product/:productId - Create new variant for a product
router.post('/product/:productId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const createdVariant = await productVariantService.createVariant(
      authToken, 
      req.params.productId, 
      req.body
    );
    res.status(201).json({ success: true, data: createdVariant });
  } catch (error) {
    next(error);
  }
});

// PUT /api/product-variants/:variantId - Update variant
router.patch('/:variantId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const updatedVariant = await productVariantService.updateVariant(
      authToken, 
      req.params.variantId, 
      req.body
    );
    res.status(200).json({ success: true, data: updatedVariant });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/product-variants/:variantId - Delete variant
router.delete('/:variantId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    await productVariantService.deleteVariant(authToken, req.params.variantId);
    res.status(200).json({ success: true, message: 'Product variant deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
