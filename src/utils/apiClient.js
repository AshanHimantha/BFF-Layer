// src/services/apiClient.js
const axios = require('axios');

/**
 * Creates and returns an Axios instance configured for a specific base URL.
 * Includes basic request/response interceptors for logging and error handling.
 * @param {string} baseURL - The base URL for the API client (e.g., 'http://localhost:3001/api/users')
 * @returns {axios.AxiosInstance} Configured Axios instance
 */
const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL: baseURL,
    timeout: 15000, // Request timeout in ms (e.g., 15 seconds)
    headers: {
      'Accept': 'application/json',
    },
  });

  // Request Interceptor: Before sending a request
  client.interceptors.request.use(
    (config) => {
      // console.log(`[API Client Request] -> ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
      // You can add authorization tokens here dynamically if needed
      // config.headers.Authorization = `Bearer ${someAuthToken}`;
      return config;
    },
    (error) => {
      // Handle request errors here
      console.error('[API Client Request Error]:', error.message);
      return Promise.reject(error);
    }
  );

  // Response Interceptor: After receiving a response
  client.interceptors.response.use(
    (response) => {
      // console.log(`[API Client Response] <- ${response.status} ${response.config.method.toUpperCase()} ${response.config.baseURL}${response.config.url}`);
      return response;
    },
    (error) => {
      // Handle response errors (e.g., 4xx, 5xx status codes)
      if (error.response) {
        // Server responded with a status code outside of 2xx
        console.error(`[API Client Response Error] ${error.response.status} - ${error.response.config.baseURL}${error.response.config.url}:`, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error(`[API Client Network Error] No response from ${error.config.baseURL}${error.config.url}:`, error.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('[API Client Setup Error]:', error.message);
      }
      // Re-throw the error so it can be caught by the calling component/route
      return Promise.reject(error);
    }
  );

  return client;
};

module.exports = createApiClient;