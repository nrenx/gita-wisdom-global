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

interface Verse {
  id: string;
  chapter_id: string;
  language_id: string;
  verse_number: number;
  sanskrit_text?: string;
  transliteration?: string;
  english_translation?: string;
  youtube_url?: string;
  title?: string;
  description?: string;
  commentary?: string;
  keywords?: string[];
  status: 'pending' | 'uploaded' | 'processing' | 'published';
  visibility: 'published' | 'hidden' | 'draft';
  is_daily_verse: boolean;
  whatsapp_share_text?: string;
}

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
}

interface Language {
  id: string;
  name: string;
  native_name: string;
}

const EditVerse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [verseResult, chaptersResult, languagesResult] = await Promise.all([
        id ? supabase.from('verses').select('*').eq('id', id).single() : Promise.resolve({ data: null }),
        supabase.from('chapters').select('id, chapter_number, title').order('chapter_number'),
        supabase.from('languages').select('id, name, native_name').eq('is_active', true).order('name')
      ]);

      if ((verseResult as any).error && id) throw (verseResult as any).error;
      if (chaptersResult.error) throw chaptersResult.error;
      if (languagesResult.error) throw languagesResult.error;

      setVerse(verseResult.data || {
        id: '',
        chapter_id: '',
        language_id: '',
        verse_number: 1,
        status: 'pending',
        visibility: 'draft',
        is_daily_verse: false
      } as Verse);
      setChapters(chaptersResult.data || []);
      setLanguages(languagesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load verse data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verse) return;

    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const keywords = (formData.get('keywords') as string)
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const verseData = {
        chapter_id: formData.get('chapter_id') as string,
        language_id: formData.get('language_id') as string,
        verse_number: parseInt(formData.get('verse_number') as string),
        sanskrit_text: formData.get('sanskrit_text') as string,
        transliteration: formData.get('transliteration') as string,
        english_translation: formData.get('english_translation') as string,
        youtube_url: formData.get('youtube_url') as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        commentary: formData.get('commentary') as string,
        keywords,
        status: formData.get('status') as 'pending' | 'uploaded' | 'processing' | 'published',
        visibility: formData.get('visibility') as 'published' | 'hidden' | 'draft',
        is_daily_verse: formData.get('is_daily_verse') === 'on',
        whatsapp_share_text: formData.get('whatsapp_share_text') as string,
      };

      if (id) {
        const { error } = await supabase.from('verses').update(verseData).eq('id', id);
        if (error) throw error;
        toast.success('Verse updated successfully');
      } else {
        const { error } = await supabase.from('verses').insert(verseData);
        if (error) throw error;
        toast.success('Verse created successfully');
      }

      navigate('/admin');
    } catch (error: any) {
      console.error('Error saving verse:', error);
      toast.error(error.message || 'Failed to save verse');
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
            {id ? 'Edit Verse' : 'Add New Verse'}
          </h1>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle className="font-cinzel text-saffron-800">Verse Details</CardTitle>
            <CardDescription>
              Edit all aspects of this Bhagavad Gita verse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chapter_id">Chapter</Label>
                  <Select name="chapter_id" defaultValue={verse?.chapter_id || ''} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.chapter_number}. {chapter.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language_id">Language</Label>
                  <Select name="language_id" defaultValue={verse?.language_id || ''} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id}>
                          {language.name} ({language.native_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verse_number">Verse Number</Label>
                  <Input
                    id="verse_number"
                    name="verse_number"
                    type="number"
                    min="1"
                    required
                    defaultValue={verse?.verse_number || ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={verse?.title || ''}
                  placeholder="Enter verse title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sanskrit_text">Sanskrit Text</Label>
                <Textarea
                  id="sanskrit_text"
                  name="sanskrit_text"
                  rows={3}
                  placeholder="Enter original Sanskrit verse..."
                  defaultValue={verse?.sanskrit_text || ''}
                  className="font-garamond"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transliteration">Transliteration</Label>
                <Textarea
                  id="transliteration"
                  name="transliteration"
                  rows={2}
                  placeholder="Enter romanized transliteration..."
                  defaultValue={verse?.transliteration || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="english_translation">English Translation</Label>
                <Textarea
                  id="english_translation"
                  name="english_translation"
                  rows={3}
                  placeholder="Enter English translation..."
                  defaultValue={verse?.english_translation || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commentary">Commentary</Label>
                <Textarea
                  id="commentary"
                  name="commentary"
                  rows={4}
                  placeholder="Enter detailed commentary or explanation..."
                  defaultValue={verse?.commentary || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  name="youtube_url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  defaultValue={verse?.youtube_url || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={2}
                  defaultValue={verse?.description || ''}
                  placeholder="Brief description of the verse"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  name="keywords"
                  placeholder="dharma, karma, devotion"
                  defaultValue={verse?.keywords?.join(', ') || ''}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={verse?.status || 'pending'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="uploaded">Uploaded</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select name="visibility" defaultValue={verse?.visibility || 'draft'}>
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
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_daily_verse"
                  name="is_daily_verse"
                  defaultChecked={verse?.is_daily_verse || false}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_daily_verse">Mark as Daily Verse</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_share_text">WhatsApp Share Text</Label>
                <Textarea
                  id="whatsapp_share_text"
                  name="whatsapp_share_text"
                  rows={2}
                  placeholder="Share text for WhatsApp..."
                  defaultValue={verse?.whatsapp_share_text || ''}
                />
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
                  {saving ? 'Saving...' : 'Save Verse'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default EditVerse;