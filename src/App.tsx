import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import PhotoPage from './pages/PhotoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UploadPage from './pages/UploadPage';
import EditPhotoPage from './pages/EditPhotoPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/photo/:id" element={<PhotoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              
              {/* Protected creator routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="creator">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute requiredRole="creator">
                  <UploadPage />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute requiredRole="creator">
                  <EditPhotoPage />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;