require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const investmentRoutes = require('./routes/investments');
const checkoutRoutes = require('./routes/checkout');
const analyticsRoutes = require('./routes/analytics');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/uploads');
const auditRoutes = require('./routes/audit');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Initialize app
const app = express();

// Connect to MongoDB (non-blocking - server will start even if DB fails)
let dbConnected = false;
(async () => {
  const connection = await connectDB();
  if (connection) {
    dbConnected = true;
  }
})();

// Middleware
app.use(helmet());
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === 'null' || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(`${process.env.API_PREFIX || '/api/v1'}/checkout/investment-orders`, rateLimiter({ max: 12, windowMs: 60_000 }));
app.use(`${process.env.API_PREFIX || '/api/v1'}/analytics/events`, rateLimiter({ max: 120, windowMs: 60_000 }));
app.use(`${process.env.API_PREFIX || '/api/v1'}/uploads/public`, rateLimiter({ max: 20, windowMs: 60_000 }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    database: dbConnected ? 'connected' : 'disconnected (offline mode)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/projects`, projectRoutes);
app.use(`${apiPrefix}/investments`, investmentRoutes);
app.use(`${apiPrefix}/checkout`, checkoutRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/settings`, settingsRoutes);
app.use(`${apiPrefix}/uploads`, uploadRoutes);
app.use(`${apiPrefix}/audit`, auditRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 AgriShare Backend Server         ║
╠═══════════════════════════════════════╣
║ Server:  http://${HOST}:${PORT}
║ API:     ${apiPrefix}
║ ENV:     ${process.env.NODE_ENV}
║ DB:      ${dbConnected ? '✅ Connected' : '⚠️  Offline Mode'}
╚═══════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
