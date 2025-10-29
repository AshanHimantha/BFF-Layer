const createApiClient = require('../utils/apiClient');

// USER_SERVICE_URL should point to the user-service base URL (e.g., http://localhost:8081)
// Version path is appended here for flexibility
const USER_SERVICE_BASE_URL = process.env.USER_SERVICE_URL;
const USER_SERVICE_VERSION = '/api/v1/users';
const userServiceClient = createApiClient(USER_SERVICE_BASE_URL + USER_SERVICE_VERSION);

const userService = {
  // ---------------- Current user endpoints ----------------
  getCurrentUser: async (authToken) => {
    try {
      const response = await userServiceClient.get('/currentUser', {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data; // be resilient to wrapped/unwrapped responses
    } catch (error) {
      console.error('UserService Error: Failed to fetch current user.', error.message);
      throw error;
    }
  },

  getMyAddresses: async (authToken) => {
    try {
      const response = await userServiceClient.get('/currentUser/addresses', {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('UserService Error: Failed to fetch user addresses.', error.message);
      throw error;
    }
  },

  addMyAddress: async (authToken, addressData) => {
    try {
      const response = await userServiceClient.post('/currentUser/addresses', addressData, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('UserService Error: Failed to add address.', error.message);
      throw error;
    }
  },

  updateMyAddress: async (authToken, addressId, addressData) => {
    try {
      const response = await userServiceClient.put(`/currentUser/addresses/${addressId}`, addressData, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`UserService Error: Failed to update address ${addressId}.`, error.message);
      throw error;
    }
  },

  deleteMyAddress: async (authToken, addressId) => {
    try {
      const response = await userServiceClient.delete(`/currentUser/addresses/${addressId}`, {
        headers: { Authorization: authToken }
      });
      return response.data;
    } catch (error) {
      console.error(`UserService Error: Failed to delete address ${addressId}.`, error.message);
      throw error;
    }
  },

  // ---------------- Admin/proxy endpoints to match Java controller ----------------
  getAllUsers: async (authToken, limit = 20, nextToken = null) => {
    try {
      const response = await userServiceClient.get('', {
        headers: { Authorization: authToken },
        params: { limit, nextToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('UserService Error: Failed to get all users.', error.message);
      throw error;
    }
  },

  getUserById: async (authToken, userId) => {
    try {
      const response = await userServiceClient.get(`/${userId}`, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`UserService Error: Failed to get user ${userId}.`, error.message);
      throw error;
    }
  },

  searchUsersByEmail: async (authToken, email) => {
    try {
      const response = await userServiceClient.get('/search', {
        headers: { Authorization: authToken },
        params: { email }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`UserService Error: Failed to search users by email ${email}.`, error.message);
      throw error;
    }
  },

  createAdminUser: async (authToken, createRequest) => {
    try {
      const response = await userServiceClient.post('', createRequest, {
        headers: { Authorization: authToken }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('UserService Error: Failed to create admin user.', error.message);
      throw error;
    }
  },

  updateUserRoles: async (authToken, userId, rolesBody) => {
    try {
      const response = await userServiceClient.put(`/${userId}/role`, rolesBody, {
        headers: { Authorization: authToken }
      });
      return response.data;
    } catch (error) {
      console.error(`UserService Error: Failed to update roles for ${userId}.`, error.message);
      throw error;
    }
  },

  updateUserStatus: async (authToken, userId, enabled) => {
    try {
      const response = await userServiceClient.put(`/${userId}/status`, { enabled }, {
        headers: { Authorization: authToken }
      });
      return response.data;
    } catch (error) {
      console.error(`UserService Error: Failed to update status for ${userId}.`, error.message);
      throw error;
    }
  }
};

module.exports = userService;