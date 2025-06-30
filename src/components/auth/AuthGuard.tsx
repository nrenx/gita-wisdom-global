
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'editor';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireRole }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sacred-gradient">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sacred-gold"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireRole && userRole !== requireRole && userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sacred-gradient">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-sacred-gold/20">
          <h2 className="text-2xl font-cinzel text-saffron-800 mb-4">Access Denied</h2>
          <p className="text-gray-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
