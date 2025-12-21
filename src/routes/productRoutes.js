const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const productService = require('../services/productService');
const { requireAuth } = require('../middleware/authMiddleware');

// Configure multer for handling multipart/form-data
const upload = multer();

// Log all product route requests similar to Laravel console output
router.use((req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - started;
    console.log('[ProductRoutes]', req.method, req.originalUrl, '->', res.statusCode, `${durationMs}ms`);
  });
  next();
});

// GET /api/products - Get all products with pagination and filtering
router.get('/', async (req, res, next) => {
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
router.get('/search', async (req, res, next) => {
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
router.get('/category/:categoryId', async (req, res, next) => {
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

// GET /api/products/admin/:productId - Get product by ID (admin endpoint)
router.get('/admin/:productId', requireAuth, async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const product = await productService.getProductByIdAdmin(authToken, req.params.productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:productId - Get product by ID
router.get('/:productId', async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const product = await productService.getProductById(authToken, req.params.productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create new product (SuperAdmins only)
router.post('/', requireAuth, upload.any(), async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    
    // Create FormData to forward to backend
    const formData = new FormData();
    
    // Add text fields from req.body
    Object.keys(req.body).forEach(key => {
      const value = req.body[key];
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Add files from req.files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        formData.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      });
    }

    const createdProduct = await productService.createProduct(authToken, formData);
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    next(error);
  }
});

const MAX_IMAGES = 6;
// PATCH /api/products/:productId - Partially update product (fields and/or files)
router.patch('/:productId', requireAuth, upload.any(), async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const hasFiles = req.files && req.files.length > 0;
    const hasBodyFields = req.body && Object.keys(req.body).length > 0;

    if (hasFiles || hasBodyFields) {
      if (hasFiles && req.files.length > MAX_IMAGES) {
        return res.status(400).json({ success: false, message: `Maximum ${MAX_IMAGES} images allowed` });
      }

      if (hasFiles) {
        const invalidField = req.files.find(file => file.fieldname !== 'files');
        if (invalidField) {
          return res.status(400).json({ success: false, message: "All uploaded files must use the 'files' field name" });
        }
      }

      const formData = new FormData();
      Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (hasFiles) {
        req.files.forEach(file => {
          formData.append('files', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
          });
        });
      }

      const patchedWithFormData = await productService.patchProduct(authToken, req.params.productId, formData);
      return res.status(200).json({ success: true, data: patchedWithFormData });
    }

    const patched = await productService.patchProduct(authToken, req.params.productId, req.body);
    res.status(200).json({ success: true, data: patched });
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
