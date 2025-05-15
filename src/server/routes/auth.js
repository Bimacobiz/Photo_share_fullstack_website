import express from 'express';
import cognito from '../config/cognito.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email and password' });
    }
    
    // Set role to consumer by default
    const userRole = role || 'consumer';
    
    // Call Cognito service to register user
    const result = await cognito.signUp(username, email, password, userRole);
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }
    
    // Call Cognito service to login user
    const result = await cognito.signIn(email, password);
    
    res.json(result);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(401).json({ error: error.message });
  }
});

export default router;