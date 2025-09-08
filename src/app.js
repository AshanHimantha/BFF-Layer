require('dotenv').config();
const express = require('express');
const webRoutes = require('./routes/webRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (always good to have)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'BFF Layer' });
});

// Mount your web application routes
app.use('/', webRoutes);

// Centralized Error Handling Middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ BFF Server running on http://localhost:${PORT}`);
});