const createApiClient = require('../utils/apiClient');

const PRODUCT_SERVICE_BASE_URL = process.env.PRODUCT_SERVICE_URL;
const PRODUCT_VARIANT_SERVICE_VERSION = '/api/v1/product-variants';
const productVariantServiceClient = createApiClient(PRODUCT_SERVICE_BASE_URL + PRODUCT_VARIANT_SERVICE_VERSION);

const productVariantService = {

  // GET /api/v1/product-variants/product/{productId} - Get all variants for a product
  getVariantsByProductId: async (authToken, productId) => {
    try {
      const response = await productVariantServiceClient.get(`/product/${productId}`, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`ProductVariantService Error: Failed to get variants for product ${productId}.`, error.message);
      throw error;
    }
  },

  // GET /api/v1/product-variants/{variantId} - Get variant by ID
  getVariantById: async (authToken, variantId) => {
    try {
      const response = await productVariantServiceClient.get(`/${variantId}`, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`ProductVariantService Error: Failed to get variant ${variantId}.`, error.message);
      throw error;
    }
  },

  // POST /api/v1/product-variants/product/{productId} - Create new variant for a product
  createVariant: async (authToken, productId, variantRequest) => {
    try {
      const response = await productVariantServiceClient.post(`/product/${productId}`, variantRequest, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`ProductVariantService Error: Failed to create variant for product ${productId}.`, error.message);
      throw error;
    }
  },

  // PATCH /api/v1/product-variants/{variantId} - Update variant
  updateVariant: async (authToken, variantId, variantRequest) => {
    try {
      const response = await productVariantServiceClient.patch(`/${variantId}`, variantRequest, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`ProductVariantService Error: Failed to update variant ${variantId}.`, error.message);
      throw error;
    }
  },

 

  // DELETE /api/v1/product-variants/{variantId} - Delete variant
  deleteVariant: async (authToken, variantId) => {
    try {
      const response = await productVariantServiceClient.delete(`/${variantId}`, {
        headers: { Authorization: authToken }
      });
      return response.data;
    } catch (error) {
      console.error(`ProductVariantService Error: Failed to delete variant ${variantId}.`, error.message);
      throw error;
    }
  }
};

module.exports = productVariantService;
