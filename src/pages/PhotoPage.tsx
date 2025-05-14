import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, MessageCircle, Eye, Calendar, Edit, Trash2, AlertTriangle } from 'lucide-react';

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

interface Comment {
  id: string;
  photoId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

const PhotoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/photos/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch photo');
        }
        
        const data = await response.json();
        setPhoto(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching photo:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/comments/photo/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setIsLoadingComments(false);
      }
    };

    if (id) {
      fetchPhoto();
      fetchComments();
    }
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated || !photo) return;

    try {
      const response = await fetch(`http://localhost:3001/api/photos/${photo.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to like photo');
      }
      
      const updatedPhoto = await response.json();
      setPhoto(updatedPhoto);
    } catch (err) {
      console.error('Error liking photo:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !photo || !newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          photoId: photo.id,
          text: newComment
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!isAuthenticated || !photo || user?.role !== 'creator') return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`http://localhost:3001/api/photos/${photo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }
      
      navigate('/');
    } catch (err) {
      console.error('Error deleting photo:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <p>Error: {error || 'Photo not found'}</p>
        <Link to="/" className="text-teal-600 hover:underline mt-4 inline-block">
          Return to home
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(photo.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Photo Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{photo.title}</h1>
            
            {isAuthenticated && user?.id === photo.userId && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/edit/${photo.id}`}
                  className="p-2 text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center mb-6">
            <Link 
              to={`/profile/${photo.userId}`}
              className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
            >
              @{photo.username}
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-500 flex items-center">
              <Calendar size={16} className="mr-1" />
              {formattedDate}
            </span>
          </div>
          
          <div className="mb-6">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <p className="text-gray-700 mb-6">{photo.description}</p>
          
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {photo.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex space-x-6">
              <button
                onClick={handleLike}
                disabled={!isAuthenticated}
                className={`flex items-center ${isAuthenticated ? 'hover:text-rose-600' : 'opacity-70'} transition-colors`}
              >
                <Heart size={20} className="mr-2 text-rose-500" />
                <span>{photo.likes} likes</span>
              </button>
              
              <div className="flex items-center">
                <MessageCircle size={20} className="mr-2 text-blue-500" />
                <span>{comments.length} comments</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Eye size={20} className="mr-2 text-gray-400" />
              <span>{photo.views} views</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Comments</h2>
          
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md mb-6 text-center">
              <p className="text-gray-600 mb-2">Want to join the conversation?</p>
              <Link 
                to="/login" 
                className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
              >
                Log in to comment
              </Link>
            </div>
          )}
          
          {isLoadingComments ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Link
                      to={`/profile/${comment.userId}`}
                      className="font-medium text-gray-800 hover:text-teal-600 transition-colors"
                    >
                      @{comment.username}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={32} className="mx-auto mb-2 text-gray-400" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-xl font-bold">Delete Photo?</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this photo? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePhoto}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoPage;