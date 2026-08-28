import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import reviewRoutes from './routes/reviewRoutes.js';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ── Middlewares ─────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : '*',
    credentials: true,
  })
);

// Body parser (10mb limit for base64 customer photo uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── API Routes ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    status: 'OK',
    service: 'Premier Lanka Tours API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbState] || 'Unknown',
      readyState: dbState,
    },
  });
});

// Mount Review API Routes under /api
app.use('/api', reviewRoutes);

// ── Static Asset Serving (Production & Unified Deployment) ──────────────────
if (fs.existsSync(distPath)) {
  console.log(`📦 Serving production static assets from: ${distPath}`);
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    // If request starts with /api, pass to API 404 handler
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Fallback 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Global error handling middleware
app.use((err, req, res, _next) => {
  console.error('[ServerError]', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

// ── Database Connection & Server Bootstrap ──────────────────────────────────
async function startServer() {
  if (!MONGODB_URI) {
    console.warn('\n' + '='.repeat(70));
    console.warn('⚠️  WARNING: MONGODB_URI environment variable is not defined!');
    console.warn('   Please configure server/.env or environment variables in your cloud host:');
    console.warn('   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/premier_tours');
    console.warn('='.repeat(70) + '\n');
  } else {
    try {
      console.log('⏳ Connecting to MongoDB Atlas...');
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log('✅ Connected to MongoDB Atlas successfully!');
    } catch (err) {
      console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
      console.warn('   Server is running in offline database mode until connection is established.');
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Premier Lanka Tours API Server listening on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Public Reviews: http://localhost:${PORT}/api/reviews/public`);
  });
}

startServer();

export default app;
