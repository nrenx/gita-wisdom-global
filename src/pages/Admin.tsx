
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  return (
    <AuthGuard requireRole="editor">
      <AdminDashboard />
    </AuthGuard>
  );
};

export default Admin;
