import express from 'express';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get comments for a photo
router.get('/photo/:photoId', async (req, res) => {
  try {
    const comments = await db.comments.getByPhotoId(req.params.photoId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add a comment to a photo (authenticated users)
router.post('/', authenticate, async (req, res) => {
  try {
    const { photoId, text } = req.body;
    
    if (!photoId || !text) {
      return res.status(400).json({ error: 'Please provide photoId and text' });
    }
    
    const photo = await db.photos.getById(photoId);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Create comment in database
    const comment = await db.comments.create({
      photoId,
      userId: req.user.id,
      username: req.user.username || 'unknown',
      text
    });
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

export default router;