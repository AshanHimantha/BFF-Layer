const createApiClient = require('../utils/apiClient');


const PRODUCT_SERVICE_BASE_URL = process.env.PRODUCT_SERVICE_URL;
const PRODUCT_SERVICE_VERSION = '/api/v1/products';
const productServiceClient = createApiClient(PRODUCT_SERVICE_BASE_URL + PRODUCT_SERVICE_VERSION);

const productService = {

  getAllProducts: async (authToken, page = 0, size = 20, sort = null, categoryId = null, search = null) => {
    try {
      const params = { page, size };
      if (sort) params.sort = sort;
      if (categoryId) params.categoryId = categoryId;
      if (search) params.search = search;

      const response = await productServiceClient.get('', {
        headers: { Authorization: authToken },
        params
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('ProductService Error: Failed to get all products.', error.message);
      throw error;
    }
  },


  getProductById: async (authToken, productId) => {
    try {
      const response = await productServiceClient.get(`/${productId}`, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`ProductService Error: Failed to get product ${productId}.`, error.message);
      throw error;
    }
  },

  getProductByIdAdmin: async (authToken, productId) => {
    try {
      const response = await productServiceClient.get(`/admin/${productId}`, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`ProductService Error: Failed to get product ${productId} (admin).`, error.message);
      throw error;
    }
  },


  getProductsByCategory: async (authToken, categoryId, page = 0, size = 20) => {
    try {
      const response = await productServiceClient.get(`/category/${categoryId}`, {
        headers: { Authorization: authToken },
        params: { page, size }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`ProductService Error: Failed to get products for category ${categoryId}.`, error.message);
      throw error;
    }
  },


  searchProducts: async (authToken, query, page = 0, size = 20) => {
    try {
      const response = await productServiceClient.get('/search', {
        headers: { Authorization: authToken },
        params: { query, page, size }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('ProductService Error: Failed to search products.', error.message);
      throw error;
    }
  },


  createProduct: async (authToken, productRequest) => {
    try {
      const response = await productServiceClient.post('', productRequest, {
        headers: { 
          Authorization: authToken,
          ...productRequest.getHeaders()
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('ProductService Error: Failed to create product.', error.message);
      throw error;
    }
  },


  updateProduct: async (authToken, productId, productRequest) => {
    try {
      const response = await productServiceClient.put(`/${productId}`, productRequest, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`ProductService Error: Failed to update product ${productId}.`, error.message);
      throw error;
    }
  },


  deleteProduct: async (authToken, productId) => {
    try {
      const response = await productServiceClient.delete(`/${productId}`, {
        headers: { Authorization: authToken }
      });
      return response.data;
    } catch (error) {
      console.error(`ProductService Error: Failed to delete product ${productId}.`, error.message);
      throw error;
    }
  },



};

module.exports = productService;
