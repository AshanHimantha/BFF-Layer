const createApiClient = require('../utils/apiClient');


const PRODUCT_SERVICE_BASE_URL = process.env.PRODUCT_SERVICE_URL;
const PRODUCT_SERVICE_VERSION = '/api/v1/category-types';
const categoryTypeServiceClient = createApiClient(PRODUCT_SERVICE_BASE_URL + PRODUCT_SERVICE_VERSION);

const categoryTypeService = {

  getAllCategoryTypes: async (authToken, page = 0, size = 20, sort = null) => {
    try {
      const params = { page, size };
      if (sort) params.sort = sort;

      const response = await categoryTypeServiceClient.get('', {
        headers: { Authorization: authToken },
        params
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('CategoryTypeService Error: Failed to get all category types.', error.message);
      throw error;
    }
  },


  getCategoryTypeById: async (authToken, categoryTypeId) => {
    try {
      const response = await categoryTypeServiceClient.get(`/${categoryTypeId}`, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`CategoryTypeService Error: Failed to get category type ${categoryTypeId}.`, error.message);
      throw error;
    }
  },


  createCategoryType: async (authToken, categoryTypeRequest) => {
    try {
      const response = await categoryTypeServiceClient.post('', categoryTypeRequest, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('CategoryTypeService Error: Failed to create category type.', error.message);
      throw error;
    }
  },


  updateCategoryType: async (authToken, categoryTypeId, categoryTypeRequest) => {
    try {
      const response = await categoryTypeServiceClient.put(`/${categoryTypeId}`, categoryTypeRequest, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`CategoryTypeService Error: Failed to update category type ${categoryTypeId}.`, error.message);
      throw error;
    }
  },


  patchCategoryType: async (authToken, categoryTypeId, partialUpdate) => {
    try {
      // Get current category type data
      const currentData = await categoryTypeServiceClient.get(`/${categoryTypeId}`, {
        headers: { Authorization: authToken }
      });
      
      const currentCategoryType = currentData.data.data || currentData.data;
      
      // Merge partial update with current data
      const mergedData = { ...currentCategoryType, ...partialUpdate };
      
      // Use PUT with merged data
      const response = await categoryTypeServiceClient.put(`/${categoryTypeId}`, mergedData, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`CategoryTypeService Error: Failed to patch category type ${categoryTypeId}.`, error.message);
      throw error;
    }
  },


  deleteCategoryType: async (authToken, categoryTypeId) => {
    try {
      const response = await categoryTypeServiceClient.delete(`/${categoryTypeId}`, {
        headers: { Authorization: authToken }
      });
      return response.data;
    } catch (error) {
      console.error(`CategoryTypeService Error: Failed to delete category type ${categoryTypeId}.`, error.message);
      throw error;
    }
  }
};

module.exports = categoryTypeService;
