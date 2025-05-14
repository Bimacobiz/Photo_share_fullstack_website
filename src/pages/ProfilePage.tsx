import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PhotoCard from '../components/PhotoCard';
import { CalendarDays, Image } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  userId: string;
  username: string;
  likes: number;
  views: number;
  createdAt: string;
  tags: string[];
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user: currentUser } = useContext(AuthContext);
  
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // If viewing own profile, use current user info
      if (id === currentUser?.id) {
        setUser({
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
          createdAt: new Date().toISOString() // Placeholder since we don't have this
        });
        setIsLoadingUser(false);
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:3001/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching user:', err);
      } finally {
        setIsLoadingUser(false);
      }
    };

    const fetchPhotos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/photos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        
        const data = await response.json();
        
        // Filter photos to only show those created by this user
        const userPhotos = data.filter((photo: Photo) => photo.userId === id);
        setPhotos(userPhotos);
      } catch (err) {
        console.error('Error fetching photos:', err);
      } finally {
        setIsLoadingPhotos(false);
      }
    };

    if (id) {
      fetchUser();
      fetchPhotos();
    }
  }, [id, token, currentUser]);

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <p>Error: {error || 'User not found'}</p>
      </div>
    );
  }

  return (
    <div>
      {/* User Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-teal-600 to-blue-700 h-32"></div>
        <div className="p-6 -mt-16">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-md">
              <div className="w-full h-full rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                <span className="text-4xl font-bold uppercase">{user.username.charAt(0)}</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-4">@{user.username}</h1>
            <p className="text-gray-600 mb-2">{user.role === 'creator' ? 'Creator' : 'Viewer'}</p>
            <div className="flex items-center text-gray-500 text-sm">
              <CalendarDays size={16} className="mr-1" />
              <span>
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Photos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Photos by {user.username}
          </h2>
          
          {isLoadingPhotos ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            </div>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map(photo => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Image size={32} className="mx-auto mb-2 text-gray-400" />
              <p>{user.username} hasn't shared any photos yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;