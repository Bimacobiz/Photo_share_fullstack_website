import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye } from 'lucide-react';

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

interface PhotoCardProps {
  photo: Photo;
  className?: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, className = '' }) => {
  const formattedDate = new Date(photo.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <Link to={`/photo/${photo.id}`} className="block relative overflow-hidden group">
        <div className="w-full aspect-[4/3] overflow-hidden">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white text-lg font-bold mb-1 line-clamp-1">{photo.title}</h3>
          <p className="text-gray-200 text-sm line-clamp-2">{photo.description}</p>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Link 
            to={`/profile/${photo.userId}`}
            className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
          >
            @{photo.username}
          </Link>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex space-x-3">
            <span className="flex items-center">
              <Heart size={16} className="mr-1 text-rose-500" />
              {photo.likes}
            </span>
            <span className="flex items-center">
              <MessageCircle size={16} className="mr-1 text-blue-500" />
              0
            </span>
          </div>
          <span className="flex items-center">
            <Eye size={16} className="mr-1 text-gray-400" />
            {photo.views}
          </span>
        </div>
        
        {photo.tags && photo.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {photo.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;