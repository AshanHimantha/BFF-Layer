// src/utils/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Log a concise error for debugging, not the full stack unless needed
    console.error(`--- ERROR CAUGHT: ${err.message} ---`);

    let statusCode = 500;
    let message = 'An unexpected internal server error occurred.';

    // This is the key improvement: we check the type of Axios error
    if (err.isAxiosError) {
        if (err.response) {
            // Case 1: The downstream service RESPONDED with an error (4xx, 5xx)
            // Example: Invalid token (401), or a server error in the Spring API (500)
            statusCode = err.response.status;
            
            // Extract the message and data from the backend response
            const backendData = err.response.data;
            let responseData = {};
            
            if (backendData && backendData.message) {
                // Use the backend's message directly
                message = backendData.message;
                // Include the data field if it exists (validation errors, etc.)
                if (backendData.data) {
                    responseData.data = backendData.data;
                }
            } else if (typeof backendData === 'string') {
                message = backendData;
            } else {
                message = `Downstream service responded with an error.`;
            }
            
            console.error(`[Downstream Error] Status: ${statusCode}, URL: ${err.config.url}, Data:`, err.response.data);
            
            // Send response with validation details if available
            return res.status(statusCode).json({
                success: false,
                message: message,
                ...responseData
            });
        } else if (err.request) {
            // Case 2: The request was made, but NO RESPONSE was received
            // Example: The Spring API is offline or the URL is wrong.
            statusCode = 503; // 503 Service Unavailable is the correct code for this
            message = 'A downstream service is currently unavailable. Please try again later.';
            console.error(`[Connection Error] Could not connect to ${err.config.baseURL}${err.config.url}`);
        }
    } else if (err.statusCode) {
        // Case 3: A custom error we threw ourselves (like the 401 from authMiddleware)
        statusCode = err.statusCode;
        message = err.message;
    }

    // Send a clean, user-friendly JSON response to the frontend
    res.status(statusCode).json({
        success: false,
        message: message,
        // In development, you might want more detail, but keep it clean for production
        // error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
};

module.exports = errorHandler;