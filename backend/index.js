require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const fs = require('fs');
const https = require('https');
const http = require('http');
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const userRoutes = require('./routes/user');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/user', userRoutes);

// Serve static frontend from /frontend/dist
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all route for SPA (must be last!)
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});

// Server start
const PORT = process.env.PORT || 5000;

if (process.env.DEV == 'true') {
  // Start the HTTP server
  http.createServer(app).listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}/`);
  });
} else {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/casualhorizons.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/casualhorizons.com/fullchain.pem')
  };

  const server = https.createServer(httpsOptions, app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on https://0.0.0.0:${PORT}/`);
  });

}