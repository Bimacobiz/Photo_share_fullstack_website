import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Camera, Menu, X, User, LogOut, Upload, LayoutDashboard } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-teal-600 transition-colors hover:text-teal-700">
            <Camera size={28} />
            <span className="text-xl font-bold">PhotoShare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'creator' && (
                  <>
                    <Link 
                      to="/upload" 
                      className="text-gray-700 hover:text-teal-600 transition-colors"
                    >
                      Upload
                    </Link>
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-teal-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors">
                    <span>{user?.username}</span>
                    <User size={18} />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link
                      to={`/profile/${user?.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-teal-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-teal-600 transition-colors"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-teal-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'creator' && (
                    <>
                      <Link
                        to="/upload"
                        className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Upload size={18} />
                        <span>Upload</span>
                      </Link>
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                      </Link>
                    </>
                  )}
                  
                  <Link
                    to={`/profile/${user?.id}`}
                    className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-teal-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors inline-block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;