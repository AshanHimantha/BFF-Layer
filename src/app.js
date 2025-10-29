require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow frontend to access BFF
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Configure allowed origins in .env
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (always good to have)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'BFF Layer' });
});

// Mount your organized routes
app.use('/', routes);

// Centralized Error Handling Middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ BFF Server running on http://localhost:${PORT}`);
});