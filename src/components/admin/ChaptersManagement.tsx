
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Eye, EyeOff, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  sanskrit_title?: string;
  english_title?: string;
  total_verses?: number;
  summary?: string;
  description?: string;
  visibility: 'published' | 'hidden' | 'draft';
  sort_order: number;
}

const ChaptersManagement = () => {
  const { isAdmin } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('chapter_number');

      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast.error('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const chapterData = {
        chapter_number: parseInt(formData.get('chapter_number') as string),
        title: formData.get('title') as string,
        sanskrit_title: formData.get('sanskrit_title') as string,
        english_title: formData.get('english_title') as string,
        total_verses: parseInt(formData.get('total_verses') as string) || null,
        summary: formData.get('summary') as string,
        description: formData.get('description') as string,
        visibility: formData.get('visibility') as 'published' | 'hidden' | 'draft',
        sort_order: parseInt(formData.get('sort_order') as string) || 0,
      };

      if (editingChapter) {
        const { error } = await supabase
          .from('chapters')
          .update(chapterData)
          .eq('id', editingChapter.id);

        if (error) throw error;
        toast.success('Chapter updated successfully');
      } else {
        const { error } = await supabase
          .from('chapters')
          .insert(chapterData);

        if (error) throw error;
        toast.success('Chapter created successfully');
      }

      setIsDialogOpen(false);
      setEditingChapter(null);
      fetchChapters();
    } catch (error: any) {
      console.error('Error saving chapter:', error);
      toast.error(error.message || 'Failed to save chapter');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Chapter deleted successfully');
      fetchChapters();
    } catch (error: any) {
      console.error('Error deleting chapter:', error);
      toast.error(error.message || 'Failed to delete chapter');
    }
  };

  const toggleVisibility = async (chapter: Chapter) => {
    try {
      const newVisibility = chapter.visibility === 'published' ? 'hidden' : 'published';
      
      const { error } = await supabase
        .from('chapters')
        .update({ visibility: newVisibility })
        .eq('id', chapter.id);

      if (error) throw error;
      toast.success(`Chapter ${newVisibility}`);
      fetchChapters();
    } catch (error: any) {
      console.error('Error updating visibility:', error);
      toast.error(error.message || 'Failed to update visibility');
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
            <CardTitle className="text-2xl font-cinzel text-saffron-800 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Chapters Management
            </CardTitle>
            <CardDescription>
              Manage the 18 chapters of Bhagavad Gita with complete metadata
            </CardDescription>
          </div>
          <Button
            onClick={() => window.location.href = '/admin/chapter'}
            className="bg-saffron-600 hover:bg-saffron-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Chapter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chapter</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Sanskrit Title</TableHead>
              <TableHead>English Title</TableHead>
              <TableHead>Verses</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chapters.map((chapter) => (
              <TableRow key={chapter.id}>
                <TableCell className="font-medium">
                  {chapter.chapter_number}
                </TableCell>
                <TableCell className="font-garamond font-medium">
                  {chapter.title}
                </TableCell>
                <TableCell className="font-garamond">
                  {chapter.sanskrit_title || '-'}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {chapter.english_title || '-'}
                </TableCell>
                <TableCell>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {chapter.total_verses || 'TBD'} verses
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      chapter.visibility === 'published'
                        ? 'bg-green-100 text-green-800'
                        : chapter.visibility === 'hidden'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {chapter.visibility}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleVisibility(chapter)}
                    >
                      {chapter.visibility === 'published' ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `/admin/chapter/${chapter.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(chapter.id)}
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

        {/* Detailed Chapter Cards */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-cinzel text-saffron-800 mb-4">Chapter Details</h3>
          <div className="grid gap-4">
            {chapters.map((chapter) => (
              <Card key={chapter.id} className="border-sacred-gold/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-cinzel text-saffron-800">
                        Chapter {chapter.chapter_number}: {chapter.title}
                      </CardTitle>
                      {chapter.sanskrit_title && (
                        <p className="text-sm font-garamond text-gray-600 mt-1">
                          Sanskrit: {chapter.sanskrit_title}
                        </p>
                      )}
                      {chapter.english_title && (
                        <p className="text-sm text-gray-600 mt-1">
                          English: {chapter.english_title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {chapter.total_verses || 'TBD'} verses
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingChapter(chapter);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {(chapter.summary || chapter.description) && (
                  <CardContent>
                    {chapter.summary && (
                      <div className="mb-4">
                        <h4 className="font-medium text-saffron-800 mb-2">Summary</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {chapter.summary}
                        </p>
                      </div>
                    )}
                    {chapter.description && (
                      <div>
                        <h4 className="font-medium text-saffron-800 mb-2">Description</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {chapter.description}
                        </p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChaptersManagement;
