import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { mkdirSync } from 'fs';

// Routes
import authRoutes from './src/server/routes/auth.js';
import photosRoutes from './src/server/routes/photos.js';
import commentsRoutes from './src/server/routes/comments.js';
import usersRoutes from './src/server/routes/users.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up file upload with multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Make uploads directory accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', usersRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Handle client-side routing
  app.get('/', (req, res) => {
    res.send('<h1> The Server is Running Successfully</h1>');
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // Create a basic route for testing
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Create uploads directory if it doesn't exist
try {
  mkdirSync(path.join(__dirname, 'uploads'));
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error('Error creating uploads directory:', err);
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});