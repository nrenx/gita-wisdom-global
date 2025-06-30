
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Language {
  id: string;
  name: string;
  code: string;
  native_name: string;
  is_active: boolean;
  verse_count?: number;
}

const LanguagesManagement = () => {
  const { isAdmin } = useAuth();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select(`
          *,
          verse_count:verses(count)
        `)
        .order('name');

      if (error) throw error;
      
      // Process the data to get verse counts
      const processedData = data?.map(lang => ({
        ...lang,
        verse_count: lang.verse_count?.[0]?.count || 0
      })) || [];
      
      setLanguages(processedData);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Failed to load languages');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const languageData = {
        name: formData.get('name') as string,
        code: formData.get('code') as string,
        native_name: formData.get('native_name') as string,
        is_active: formData.get('is_active') === 'on',
      };

      if (editingLanguage) {
        const { error } = await supabase
          .from('languages')
          .update(languageData)
          .eq('id', editingLanguage.id);

        if (error) throw error;
        toast.success('Language updated successfully');
      } else {
        const { error } = await supabase
          .from('languages')
          .insert(languageData);

        if (error) throw error;
        toast.success('Language created successfully');
      }

      setIsDialogOpen(false);
      setEditingLanguage(null);
      fetchLanguages();
    } catch (error: any) {
      console.error('Error saving language:', error);
      toast.error(error.message || 'Failed to save language');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this language? This will also delete all associated verses.')) return;

    try {
      const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Language deleted successfully');
      fetchLanguages();
    } catch (error: any) {
      console.error('Error deleting language:', error);
      toast.error(error.message || 'Failed to delete language');
    }
  };

  const toggleActive = async (language: Language) => {
    try {
      const { error } = await supabase
        .from('languages')
        .update({ is_active: !language.is_active })
        .eq('id', language.id);

      if (error) throw error;
      toast.success(`Language ${!language.is_active ? 'activated' : 'deactivated'}`);
      fetchLanguages();
    } catch (error: any) {
      console.error('Error updating language status:', error);
      toast.error(error.message || 'Failed to update language status');
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-cinzel text-saffron-800">
              Languages Management
            </CardTitle>
            <CardDescription>
              Manage available languages for verse translations
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingLanguage(null);
                  setIsDialogOpen(true);
                }}
                className="bg-saffron-600 hover:bg-saffron-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-cinzel text-saffron-800">
                  {editingLanguage ? 'Edit Language' : 'Add New Language'}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Language Name (English)</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Hindi"
                      defaultValue={editingLanguage?.name || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Language Code</Label>
                    <Input
                      id="code"
                      name="code"
                      required
                      placeholder="hi"
                      maxLength={5}
                      defaultValue={editingLanguage?.code || ''}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="native_name">Native Name</Label>
                  <Input
                    id="native_name"
                    name="native_name"
                    placeholder="हिंदी"
                    defaultValue={editingLanguage?.native_name || ''}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    defaultChecked={editingLanguage?.is_active ?? true}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-saffron-600 hover:bg-saffron-700">
                    {editingLanguage ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Language</TableHead>
              <TableHead>Native Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Verses Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {languages.map((language) => (
              <TableRow key={language.id}>
                <TableCell className="font-medium">
                  {language.name}
                </TableCell>
                <TableCell className="font-garamond">
                  {language.native_name || '-'}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {language.code}
                </TableCell>
                <TableCell>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {language.verse_count || 0} verses
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      language.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {language.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(language)}
                    >
                      {language.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingLanguage(language);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(language.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {languages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No languages found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguagesManagement;
