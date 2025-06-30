
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, EyeOff, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Language {
  id: string;
  name: string;
  code: string;
  native_name: string;
  is_active: boolean;
  verse_count?: number;
  chapter_count?: number;
  manual_verse_count?: number;
  manual_chapter_count?: number;
}

const LanguagesManagement = () => {
  const { isAdmin } = useAuth();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCounts, setEditingCounts] = useState<{ [key: string]: { verses: number; chapters: number } }>({});

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select(`
          *,
          verse_count:verses(count),
          chapter_count:verses(chapter_id)
        `)
        .order('name');

      if (error) throw error;
      
      // Process the data to get verse counts and unique chapter counts
      const processedData = data?.map(lang => {
        const actualVerseCount = lang.verse_count?.[0]?.count || 0;
        const uniqueChapters = new Set(lang.chapter_count?.map((v: any) => v.chapter_id) || []);
        const actualChapterCount = uniqueChapters.size;
        
        return {
          ...lang,
          verse_count: actualVerseCount,
          chapter_count: actualChapterCount,
          manual_verse_count: lang.manual_verse_count || actualVerseCount,
          manual_chapter_count: lang.manual_chapter_count || actualChapterCount
        };
      }) || [];
      
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
        manual_verse_count: parseInt(formData.get('manual_verse_count') as string) || 0,
        manual_chapter_count: parseInt(formData.get('manual_chapter_count') as string) || 0,
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

  const updateCounts = async (languageId: string, verses: number, chapters: number) => {
    try {
      const { error } = await supabase
        .from('languages')
        .update({
          manual_verse_count: verses,
          manual_chapter_count: chapters
        })
        .eq('id', languageId);

      if (error) throw error;
      toast.success('Counts updated successfully');
      fetchLanguages();
      
      // Clear editing state for this language
      setEditingCounts(prev => {
        const newState = { ...prev };
        delete newState[languageId];
        return newState;
      });
    } catch (error: any) {
      console.error('Error updating counts:', error);
      toast.error(error.message || 'Failed to update counts');
    }
  };

  const startEditingCounts = (language: Language) => {
    setEditingCounts(prev => ({
      ...prev,
      [language.id]: {
        verses: language.manual_verse_count || 0,
        chapters: language.manual_chapter_count || 0
      }
    }));
  };

  const cancelEditingCounts = (languageId: string) => {
    setEditingCounts(prev => {
      const newState = { ...prev };
      delete newState[languageId];
      return newState;
    });
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
            <CardTitle className="text-2xl font-cinzel text-saffron-800 flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Languages Management
            </CardTitle>
            <CardDescription>
              Manage available languages and track translation progress
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manual_verse_count">Verses Uploaded</Label>
                    <Input
                      id="manual_verse_count"
                      name="manual_verse_count"
                      type="number"
                      min="0"
                      max="700"
                      placeholder="0"
                      defaultValue={editingLanguage?.manual_verse_count || 0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manual_chapter_count">Chapters Completed</Label>
                    <Input
                      id="manual_chapter_count"
                      name="manual_chapter_count"
                      type="number"
                      min="0"
                      max="18"
                      placeholder="0"
                      defaultValue={editingLanguage?.manual_chapter_count || 0}
                    />
                  </div>
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
              <TableHead>Verses Uploaded</TableHead>
              <TableHead>Chapters Completed</TableHead>
              <TableHead>Progress</TableHead>
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
                  {editingCounts[language.id] ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max="700"
                        value={editingCounts[language.id].verses}
                        onChange={(e) => setEditingCounts(prev => ({
                          ...prev,
                          [language.id]: {
                            ...prev[language.id],
                            verses: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="w-20"
                      />
                      <Button
                        size="sm"
                        onClick={() => updateCounts(
                          language.id,
                          editingCounts[language.id].verses,
                          editingCounts[language.id].chapters
                        )}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEditingCounts(language.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {language.manual_verse_count || 0} / 700
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditingCounts(language)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingCounts[language.id] ? (
                    <Input
                      type="number"
                      min="0"
                      max="18"
                      value={editingCounts[language.id].chapters}
                      onChange={(e) => setEditingCounts(prev => ({
                        ...prev,
                        [language.id]: {
                          ...prev[language.id],
                          chapters: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-20"
                    />
                  ) : (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                      {language.manual_chapter_count || 0} / 18
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(((language.manual_verse_count || 0) / 700) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {Math.round(((language.manual_verse_count || 0) / 700) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(((language.manual_chapter_count || 0) / 18) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {Math.round(((language.manual_chapter_count || 0) / 18) * 100)}%
                      </span>
                    </div>
                  </div>
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
