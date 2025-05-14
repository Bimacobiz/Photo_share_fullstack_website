import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <Search size={64} className="mx-auto mb-4 text-gray-400" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors inline-block"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;