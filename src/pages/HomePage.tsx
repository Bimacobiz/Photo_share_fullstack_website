import React, { useState, useEffect } from 'react';
import PhotoCard from '../components/PhotoCard';
import { Camera } from 'lucide-react';

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

const HomePage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/photos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching photos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-700 text-white rounded-lg shadow-lg mb-10 p-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Share Your Vision With The World</h1>
          <p className="text-xl mb-8 text-teal-100">
            Discover stunning photos from creators around the globe or showcase your own masterpieces.
          </p>
        </div>
      </section>

      {/* Photos Feed */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Photos</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            <p>Error: {error}</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No photos found</h3>
            <p className="text-gray-500">
              Be the first to upload amazing photos!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;