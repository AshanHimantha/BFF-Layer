const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { requireAuth } = require('../middleware/authMiddleware');

// GET /api/products - Get all products with pagination and filtering
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const page = req.query.page || 0;
    const size = req.query.size || 20;
    const sort = req.query.sort;
    const categoryId = req.query.categoryId;
    const search = req.query.search;

    const result = await productService.getAllProducts(authToken, page, size, sort, categoryId, search);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/search - Search products
router.get('/search', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const query = req.query.query || req.query.q;
    const page = req.query.page || 0;
    const size = req.query.size || 20;

    const result = await productService.searchProducts(authToken, query, page, size);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/category/:categoryId - Get products by category
router.get('/category/:categoryId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const page = req.query.page || 0;
    const size = req.query.size || 20;

    const result = await productService.getProductsByCategory(authToken, req.params.categoryId, page, size);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:productId - Get product by ID
router.get('/:productId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const product = await productService.getProductById(authToken, req.params.productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create new product (SuperAdmins only)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const createdProduct = await productService.createProduct(authToken, req.body);
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:productId - Update product (SuperAdmins only)
router.put('/:productId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const updatedProduct = await productService.updateProduct(authToken, req.params.productId, req.body);
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/products/:productId/stock - Update product stock
router.patch('/:productId/stock', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const { stock } = req.body;
    const updatedProduct = await productService.updateProductStock(authToken, req.params.productId, stock);
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:productId - Delete product (SuperAdmins only)
router.delete('/:productId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    await productService.deleteProduct(authToken, req.params.productId);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
