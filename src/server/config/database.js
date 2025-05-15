import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

// Configure AWS
AWS.config.update({
  region: process.env.AWS_RDS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// This is a placeholder for AWS RDS connection
// In a real implementation, you would use a proper database client
// like pg for PostgreSQL or mysql2 for MySQL
const db = {
  // Simulating photo table operations
  photos: {
    getAll: async () => {
      console.log('Fetching all photos from RDS');
      return mockPhotos;
    },
    getById: async (id) => {
      console.log(`Fetching photo with ID ${id} from RDS`);
      return mockPhotos.find(photo => photo.id === id) || null;
    },
    create: async (photo) => {
      console.log('Creating new photo in RDS', photo);
      const newPhoto = { 
        ...photo, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      mockPhotos.push(newPhoto);
      return newPhoto;
    },
    update: async (id, data) => {
      console.log(`Updating photo with ID ${id} in RDS`, data);
      const index = mockPhotos.findIndex(photo => photo.id === id);
      if (index !== -1) {
        mockPhotos[index] = { ...mockPhotos[index], ...data };
        return mockPhotos[index];
      }
      return null;
    },
    delete: async (id) => {
      console.log(`Deleting photo with ID ${id} from RDS`);
      const index = mockPhotos.findIndex(photo => photo.id === id);
      if (index !== -1) {
        const deleted = mockPhotos[index];
        mockPhotos.splice(index, 1);
        return deleted;
      }
      return null;
    }
  },
  // Add other tables as needed (users, comments, etc.)
  users: {
    getById: async (id) => {
      console.log(`Fetching user with ID ${id} from RDS`);
      return mockUsers.find(user => user.id === id) || null;
    },
    getByEmail: async (email) => {
      console.log(`Fetching user with email ${email} from RDS`);
      return mockUsers.find(user => user.email === email) || null;
    },
    create: async (user) => {
      console.log('Creating new user in RDS', user);
      const newUser = { 
        ...user, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      mockUsers.push(newUser);
      return newUser;
    }
  },
  comments: {
    getByPhotoId: async (photoId) => {
      console.log(`Fetching comments for photo ID ${photoId} from RDS`);
      return mockComments.filter(comment => comment.photoId === photoId);
    },
    create: async (comment) => {
      console.log('Creating new comment in RDS', comment);
      const newComment = { 
        ...comment, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      mockComments.push(newComment);
      return newComment;
    }
  }
};

// Mock data for development
let mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$XlPBCdga4OOtMRFOjaycU.3JrA6j2.7Uejb0FT7Z1vSEHq4EFPXEG', // password123
    role: 'creator',
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: '$2a$10$XlPBCdga4OOtMRFOjaycU.3JrA6j2.7Uejb0FT7Z1vSEHq4EFPXEG', // password123
    role: 'consumer',
    createdAt: '2023-01-02T00:00:00.000Z'
  }
];

let mockPhotos = [
  {
    id: '1',
    title: 'Beautiful Sunset',
    description: 'A stunning sunset over the mountains',
    imageUrl: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg',
    userId: '1',
    username: 'admin',
    likes: 24,
    views: 128,
    createdAt: '2023-01-15T00:00:00.000Z',
    tags: ['sunset', 'mountains', 'nature']
  },
  {
    id: '2',
    title: 'City Skyline',
    description: 'Night view of a vibrant city skyline',
    imageUrl: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg',
    userId: '1',
    username: 'admin',
    likes: 18,
    views: 95,
    createdAt: '2023-01-20T00:00:00.000Z',
    tags: ['city', 'night', 'urban']
  },
  {
    id: '3',
    title: 'Mountain Lake',
    description: 'Serene mountain lake at sunrise',
    imageUrl: 'https://images.pexels.com/photos/147411/pexels-photo-147411.jpeg',
    userId: '1',
    username: 'admin',
    likes: 32,
    views: 156,
    createdAt: '2023-02-05T00:00:00.000Z',
    tags: ['lake', 'mountains', 'sunrise']
  }
];

let mockComments = [
  {
    id: '1',
    photoId: '1',
    userId: '2',
    username: 'user',
    text: 'This is absolutely breathtaking!',
    createdAt: '2023-01-16T00:00:00.000Z'
  },
  {
    id: '2',
    photoId: '1',
    userId: '1',
    username: 'admin',
    text: 'Thank you! It was an amazing moment to capture.',
    createdAt: '2023-01-16T12:00:00.000Z'
  },
  {
    id: '3',
    photoId: '2',
    userId: '2',
    username: 'user',
    text: 'Love the city lights!',
    createdAt: '2023-01-21T00:00:00.000Z'
  }
];

export default db;