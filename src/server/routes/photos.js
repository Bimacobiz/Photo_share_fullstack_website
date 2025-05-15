import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from '../config/database.js';
import { authenticate, isCreator } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(dirname(dirname(dirname(__dirname))), 'uploads'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get all photos
router.get('/', async (req, res) => {
  try {
    const photos = await db.photos.getAll();
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Get a single photo by ID
router.get('/:id', async (req, res) => {
  try {
    const photo = await db.photos.getById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    res.json(photo);
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

// Create a new photo (creators only)
router.post('/', authenticate, isCreator, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    let imageUrl = '';
    
    // If image was uploaded, set the URL
    if (req.file) {
      // In a real app, this would be the S3 URL
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      // If external URL was provided
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ error: 'Please provide an image' });
    }
    
    // Parse tags if provided
    const parsedTags = tags ? JSON.parse(tags) : [];
    
    // Create photo in database
    const photo = await db.photos.create({
      title,
      description,
      imageUrl,
      userId: req.user.id,
      username: req.user.username || 'unknown',
      likes: 0,
      views: 0,
      tags: parsedTags
    });
    
    res.status(201).json(photo);
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ error: 'Failed to create photo' });
  }
});

// Update a photo (creators only)
router.put('/:id', authenticate, isCreator, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    const photo = await db.photos.getById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Check if user is the owner of the photo
    if (photo.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this photo' });
    }
    
    // Update photo in database
    const updatedPhoto = await db.photos.update(req.params.id, {
      title: title || photo.title,
      description: description || photo.description,
      tags: tags ? JSON.parse(tags) : photo.tags
    });
    
    res.json(updatedPhoto);
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).json({ error: 'Failed to update photo' });
  }
});

// Delete a photo (creators only)
router.delete('/:id', authenticate, isCreator, async (req, res) => {
  try {
    const photo = await db.photos.getById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Check if user is the owner of the photo
    if (photo.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this photo' });
    }
    
    // Delete photo from database
    await db.photos.delete(req.params.id);
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Like a photo (authenticated users)
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const photo = await db.photos.getById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Update likes count
    const updatedPhoto = await db.photos.update(req.params.id, {
      likes: photo.likes + 1
    });
    
    res.json(updatedPhoto);
  } catch (error) {
    console.error('Error liking photo:', error);
    res.status(500).json({ error: 'Failed to like photo' });
  }
});

export default router;