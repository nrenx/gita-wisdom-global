
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, UserX, Crown, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  email?: string;
}

interface AuthUser {
  id: string;
  email?: string;
}

const ProfilesManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // First get profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get user emails from auth.users (this requires admin privileges)
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.warn('Could not fetch user emails (admin access required):', usersError);
      }

      // Combine profile and user data
      const combinedData = profilesData?.map(profile => {
        const userInfo = usersData?.users?.find((user: AuthUser) => user.id === profile.id);
        return {
          ...profile,
          email: userInfo?.email || 'N/A'
        };
      }) || [];

      setProfiles(combinedData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`User role updated to ${newRole}`);
      fetchProfiles();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'editor':
        return <Edit className="h-4 w-4 text-blue-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sacred-gold"></div>
      </div>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-sacred-gold/20">
      <CardHeader>
        <CardTitle className="text-2xl font-cinzel text-saffron-800">
          User Management
        </CardTitle>
        <CardDescription>
          Manage user roles and permissions (Admin only)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">
                  {profile.full_name || 'No name'}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {profile.email}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(profile.role)}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRoleColor(profile.role)}`}
                    >
                      {profile.role}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(profile.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={profile.role}
                    onValueChange={(newRole: 'admin' | 'editor' | 'viewer') => 
                      updateUserRole(profile.id, newRole)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Viewer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex items-center space-x-2">
                          <Edit className="h-4 w-4" />
                          <span>Editor</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4" />
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {profiles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found.
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Role Permissions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>Admin:</strong> Full access to all features including user management</li>
            <li><strong>Editor:</strong> Can create, edit, and manage chapters, verses, and languages</li>
            <li><strong>Viewer:</strong> Read-only access to the admin panel</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilesManagement;
