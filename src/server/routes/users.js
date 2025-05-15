import express from 'express';
import db from '../config/database.js';
import { authenticate, isOwnerOrCreator } from '../middleware/auth.js';

const router = express.Router();

// Get user profile (protected route)
router.get('/:id', authenticate, isOwnerOrCreator, async (req, res) => {
  try {
    const user = await db.users.getById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;