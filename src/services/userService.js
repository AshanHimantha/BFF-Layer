const createApiClient = require('../utils/apiClient');

const userServiceClient = createApiClient(process.env.USER_SERVICE_URL);

const userService = {
  /**
   * Fetches the currently authenticated user's profile from GET /currentUser.
   */
  getCurrentUser: async (authToken) => {
    try {
      const response = await userServiceClient.get('/currentUser', {
        headers: { 'Authorization': authToken }
      });
      return response.data;
    } catch (error) {
      console.error('UserService Error: Failed to fetch current user.', error.message);
      throw error;
    }
  },

  /**
   * Fetches all addresses for the currently authenticated user from GET /currentUser/addresses.
   */
  getMyAddresses: async (authToken) => {
    try {
      const response = await userServiceClient.get('/currentUser/addresses', {
        headers: { 'Authorization': authToken }
      });
      return response.data.data;
    } catch (error) {
      console.error('UserService Error: Failed to fetch user addresses.', error.message);
      throw error;
    }
  },

  /**
   * Adds a new address for the current user via POST /currentUser/addresses.
   */
  addMyAddress: async (authToken, addressData) => {
    try {
      const response = await userServiceClient.post('/currentUser/addresses', addressData, {
        headers: { 'Authorization': authToken }
      });
      return response.data.data;
    } catch (error) {
      console.error('UserService Error: Failed to add address.', error.message);
      throw error;
    }
  },

  /**
   * Updates an existing address for the current user via PUT /currentUser/addresses/{addressId}.
   */
  updateMyAddress: async (authToken, addressId, addressData) => {
    try {
      const response = await userServiceClient.put(`/currentUser/addresses/${addressId}`, addressData, {
        headers: { 'Authorization': authToken }
      });
      return response.data.data;
    } catch (error) {
      console.error(`UserService Error: Failed to update address ${addressId}.`, error.message);
      throw error;
    }
  },

  /**
   * Deletes an address for the current user via DELETE /currentUser/addresses/{addressId}.
   */
  deleteMyAddress: async (authToken, addressId) => {
    try {
      const response = await userServiceClient.delete(`/currentUser/addresses/${addressId}`, {
        headers: { 'Authorization': authToken }
      });
      return response.data;
    } catch (error) {
      console.error(`UserService Error: Failed to delete address ${addressId}.`, error.message);
      throw error;
    }
  }
};

module.exports = userService;