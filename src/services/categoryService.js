const createApiClient = require('../utils/apiClient');


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


  createCategory: async (authToken, categoryRequest) => {
    try {
      const response = await categoryServiceClient.post('', categoryRequest, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('CategoryService Error: Failed to create category.', error.message);
      throw error;
    }
  },


  updateCategory: async (authToken, categoryId, categoryRequest) => {
    try {
      const response = await categoryServiceClient.put(`/${categoryId}`, categoryRequest, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`CategoryService Error: Failed to update category ${categoryId}.`, error.message);
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
