import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import AuthGuard from '@/components/auth/AuthGuard';

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  description?: string;
  sanskrit_title?: string;
  english_title?: string;
  total_verses?: number;
  summary?: string;
  visibility: 'published' | 'hidden' | 'draft';
  sort_order?: number;
}

const EditChapter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchChapter();
  }, [id]);

  const fetchChapter = async () => {
    try {
      if (id) {
        const { data, error } = await supabase
          .from('chapters')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setChapter(data);
      } else {
        setChapter({
          id: '',
          chapter_number: 1,
          title: '',
          visibility: 'draft'
        } as Chapter);
      }
    } catch (error) {
      console.error('Error fetching chapter:', error);
      toast.error('Failed to load chapter data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter) return;

    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      const chapterData = {
        chapter_number: parseInt(formData.get('chapter_number') as string),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        sanskrit_title: formData.get('sanskrit_title') as string,
        english_title: formData.get('english_title') as string,
        total_verses: parseInt(formData.get('total_verses') as string) || 0,
        summary: formData.get('summary') as string,
        visibility: formData.get('visibility') as 'published' | 'hidden' | 'draft',
        sort_order: parseInt(formData.get('sort_order') as string) || 0,
      };

      if (id) {
        const { error } = await supabase
          .from('chapters')
          .update(chapterData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Chapter updated successfully');
      } else {
        const { error } = await supabase
          .from('chapters')
          .insert(chapterData);

        if (error) throw error;
        toast.success('Chapter created successfully');
      }

      navigate('/admin');
    } catch (error: any) {
      console.error('Error saving chapter:', error);
      toast.error(error.message || 'Failed to save chapter');
    } finally {
      setSaving(false);
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
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-cinzel text-saffron-800">
            {id ? 'Edit Chapter' : 'Add New Chapter'}
          </h1>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle className="font-cinzel text-saffron-800">Chapter Details</CardTitle>
            <CardDescription>
              Edit all metadata for this Bhagavad Gita chapter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chapter_number">Chapter Number</Label>
                  <Input
                    id="chapter_number"
                    name="chapter_number"
                    type="number"
                    min="1"
                    max="18"
                    required
                    defaultValue={chapter?.chapter_number || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_verses">Total Verses</Label>
                  <Input
                    id="total_verses"
                    name="total_verses"
                    type="number"
                    min="0"
                    defaultValue={chapter?.total_verses || ''}
                    placeholder="Number of verses in this chapter"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Chapter Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={chapter?.title || ''}
                  placeholder="e.g., Crisis and Calling"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sanskrit_title">Sanskrit Title</Label>
                <Input
                  id="sanskrit_title"
                  name="sanskrit_title"
                  defaultValue={chapter?.sanskrit_title || ''}
                  placeholder="e.g., Arjuna Vishada Yoga"
                  className="font-garamond"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="english_title">English Translation Title</Label>
                <Input
                  id="english_title"
                  name="english_title"
                  defaultValue={chapter?.english_title || ''}
                  placeholder="e.g., The Yoga of Arjuna's Dejection"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={chapter?.description || ''}
                  placeholder="Brief description of the chapter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  rows={4}
                  defaultValue={chapter?.summary || ''}
                  placeholder="Detailed spiritual overview and context of the chapter..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select name="visibility" defaultValue={chapter?.visibility || 'draft'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    min="0"
                    defaultValue={chapter?.sort_order || ''}
                    placeholder="Display order"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-saffron-600 hover:bg-saffron-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Chapter'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default EditChapter;