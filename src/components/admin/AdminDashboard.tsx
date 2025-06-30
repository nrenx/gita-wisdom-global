
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, BookOpen, Languages, FileText, Users } from 'lucide-react';
import ChaptersManagement from './ChaptersManagement';
import VersesManagement from './VersesManagement';
import LanguagesManagement from './LanguagesManagement';
import ProfilesManagement from './ProfilesManagement';

const AdminDashboard = () => {
  const { user, signOut, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('chapters');

  return (
    <div className="min-h-screen bg-sacred-gradient">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-sacred-gold/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-cinzel text-saffron-800">
                🕉️ Admin Panel
              </h1>
              <span className="text-sm bg-sacred-gold/20 px-2 py-1 rounded text-saffron-700 capitalize">
                {userRole}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="border-saffron-300 text-saffron-700 hover:bg-saffron-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="chapters" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Chapters</span>
            </TabsTrigger>
            <TabsTrigger value="verses" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Verses</span>
            </TabsTrigger>
            <TabsTrigger value="languages" className="flex items-center space-x-2">
              <Languages className="h-4 w-4" />
              <span>Languages</span>
            </TabsTrigger>
            {userRole === 'admin' && (
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="chapters">
            <ChaptersManagement />
          </TabsContent>

          <TabsContent value="verses">
            <VersesManagement />
          </TabsContent>

          <TabsContent value="languages">
            <LanguagesManagement />
          </TabsContent>

          {userRole === 'admin' && (
            <TabsContent value="users">
              <ProfilesManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
