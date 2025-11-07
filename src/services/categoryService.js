const createApiClient = require('../utils/apiClient');
const FormData = require('form-data');

const PRODUCT_SERVICE_BASE_URL = process.env.PRODUCT_SERVICE_URL;
const PRODUCT_SERVICE_VERSION = '/api/v1/categories';
const categoryServiceClient = createApiClient(PRODUCT_SERVICE_BASE_URL + PRODUCT_SERVICE_VERSION);

const categoryService = {

  getAllCategories: async (authToken, page = 0, size = 20, sort = null) => {
    try {
      const params = { page, size };
      if (sort) params.sort = sort;

      const response = await categoryServiceClient.get('', {
        headers: { Authorization: authToken },
        params
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('CategoryService Error: Failed to get all categories.', error.message);
      throw error;
    }
  },


  getCategoryById: async (authToken, categoryId) => {
    try {
      const response = await categoryServiceClient.get(`/${categoryId}`, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`CategoryService Error: Failed to get category ${categoryId}.`, error.message);
      throw error;
    }
  },


  createCategory: async (authToken, categoryRequest, file) => {
    try {
      console.log('=== CREATE CATEGORY DEBUG ===');
      console.log('Category Request:', categoryRequest);
      console.log('File:', file ? { originalname: file.originalname, mimetype: file.mimetype, size: file.size } : 'No file');
      
      const formData = new FormData();
      
      // Append each field from categoryRequest individually (skip image field as it should be a file)
      Object.keys(categoryRequest).forEach(key => {
        if (categoryRequest[key] !== undefined && categoryRequest[key] !== null && key !== 'image') {
          console.log(`Appending field: ${key} = ${categoryRequest[key]}`);
          formData.append(key, categoryRequest[key]);
        }
      });
      
      // Append the image file if present
      if (file) {
        console.log('Appending image file...');
        formData.append('image', file.buffer, file.originalname);
      }

      const response = await categoryServiceClient.post('', formData, {
        headers: { 
          Authorization: authToken,
          ...formData.getHeaders()
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('CategoryService Error: Failed to create category.', error.message);
      console.error('Full error:', error);
      throw error;
    }
  },


  updateCategory: async (authToken, categoryId, categoryRequest, file) => {
    try {
      const formData = new FormData();
      
      // Append each field from categoryRequest individually (skip image field as it should be a file)
      Object.keys(categoryRequest).forEach(key => {
        if (categoryRequest[key] !== undefined && categoryRequest[key] !== null && key !== 'image') {
          formData.append(key, categoryRequest[key]);
        }
      });
      
      // Append the image file if present
      if (file) {
        formData.append('image', file.buffer, file.originalname);
      }

      const response = await categoryServiceClient.put(`/${categoryId}`, formData, {
        headers: { 
          Authorization: authToken,
          ...formData.getHeaders()
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`CategoryService Error: Failed to update category ${categoryId}.`, error.message);
      throw error;
    }
  },


  patchCategory: async (authToken, categoryId, partialUpdate) => {
    try {
      // PATCH to /{categoryId}/status endpoint
      const response = await categoryServiceClient.patch(`/${categoryId}/status`, partialUpdate, {
        headers: { 
          Authorization: authToken,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`CategoryService Error: Failed to patch category ${categoryId}.`, error.message);
      throw error;
    }
  },


  deleteCategory: async (authToken, categoryId) => {
    try {
      const response = await categoryServiceClient.delete(`/${categoryId}`, {
        headers: { Authorization: authToken }
      });
      return response.data;
    } catch (error) {
      console.error(`CategoryService Error: Failed to delete category ${categoryId}.`, error.message);
      throw error;
    }
  }
};

module.exports = categoryService;
