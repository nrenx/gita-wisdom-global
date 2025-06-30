
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Eye, EyeOff, Trash2, Filter, Search, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Verse {
  id: string;
  chapter_id: string;
  language_id: string;
  verse_number: number;
  sanskrit_text?: string;
  transliteration?: string;
  english_translation?: string;
  youtube_url?: string;
  video_file_path?: string;
  title?: string;
  description?: string;
  commentary?: string;
  keywords?: string[];
  status: 'pending' | 'uploaded' | 'processing' | 'published';
  visibility: 'published' | 'hidden' | 'draft';
  is_daily_verse: boolean;
  whatsapp_share_text?: string;
  chapters?: { title: string; chapter_number: number; sanskrit_title?: string };
  languages?: { name: string; native_name: string };
}

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  sanskrit_title?: string;
  english_title?: string;
  total_verses?: number;
  summary?: string;
}

interface Language {
  id: string;
  name: string;
  native_name: string;
  verse_count?: number;
  chapter_count?: number;
}

const VersesManagement = () => {
  const { isAdmin } = useAuth();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVerse, setEditingVerse] = useState<Verse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChapter, setFilterChapter] = useState<string>('');
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [versesResult, chaptersResult, languagesResult] = await Promise.all([
        supabase
          .from('verses')
          .select(`
            *,
            chapters (title, chapter_number, sanskrit_title, english_title, total_verses, summary),
            languages (name, native_name)
          `)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('chapters')
          .select('*')
          .order('chapter_number'),
        
        supabase
          .from('languages')
          .select('*')
          .eq('is_active', true)
          .order('name')
      ]);

      if (versesResult.error) throw versesResult.error;
      if (chaptersResult.error) throw chaptersResult.error;
      if (languagesResult.error) throw languagesResult.error;

      setVerses(versesResult.data || []);
      setChapters(chaptersResult.data || []);
      setLanguages(languagesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
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

      if (editingVerse) {
        const { error } = await supabase
          .from('verses')
          .update(verseData)
          .eq('id', editingVerse.id);

        if (error) throw error;
        toast.success('Verse updated successfully');
      } else {
        const { error } = await supabase
          .from('verses')
          .insert(verseData);

        if (error) throw error;
        toast.success('Verse created successfully');
      }

      setIsDialogOpen(false);
      setEditingVerse(null);
      fetchData();
    } catch (error: any) {
      console.error('Error saving verse:', error);
      toast.error(error.message || 'Failed to save verse');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this verse?')) return;

    try {
      const { error } = await supabase
        .from('verses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Verse deleted successfully');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting verse:', error);
      toast.error(error.message || 'Failed to delete verse');
    }
  };

  const filteredVerses = verses.filter(verse => {
    const matchesSearch = !searchTerm || 
      verse.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.sanskrit_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.english_translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.verse_number.toString().includes(searchTerm);
    
    const matchesChapter = !filterChapter || verse.chapter_id === filterChapter;
    const matchesLanguage = !filterLanguage || verse.language_id === filterLanguage;
    const matchesStatus = !filterStatus || verse.status === filterStatus;
    
    return matchesSearch && matchesChapter && matchesLanguage && matchesStatus;
  });

  const groupedVerses = filteredVerses.reduce((acc, verse) => {
    const chapterNum = verse.chapters?.chapter_number || 0;
    if (!acc[chapterNum]) {
      acc[chapterNum] = [];
    }
    acc[chapterNum].push(verse);
    return acc;
  }, {} as Record<number, Verse[]>);

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
              Verses Management
            </CardTitle>
            <CardDescription>
              Manage all 700 verses of the Bhagavad Gita with translations and commentary
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingVerse(null);
                  setIsDialogOpen(true);
                }}
                className="bg-saffron-600 hover:bg-saffron-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Verse
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-cinzel text-saffron-800">
                  {editingVerse ? 'Edit Verse' : 'Add New Verse'}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chapter_id">Chapter</Label>
                    <Select name="chapter_id" defaultValue={editingVerse?.chapter_id || ''} required>
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
                    <Select name="language_id" defaultValue={editingVerse?.language_id || ''} required>
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
                      defaultValue={editingVerse?.verse_number || ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingVerse?.title || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sanskrit_text">Sanskrit Text</Label>
                  <Textarea
                    id="sanskrit_text"
                    name="sanskrit_text"
                    rows={3}
                    placeholder="Enter original Sanskrit verse..."
                    defaultValue={editingVerse?.sanskrit_text || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transliteration">Transliteration</Label>
                  <Textarea
                    id="transliteration"
                    name="transliteration"
                    rows={2}
                    placeholder="Enter romanized transliteration..."
                    defaultValue={editingVerse?.transliteration || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="english_translation">English Translation</Label>
                  <Textarea
                    id="english_translation"
                    name="english_translation"
                    rows={3}
                    placeholder="Enter English translation..."
                    defaultValue={editingVerse?.english_translation || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commentary">Commentary</Label>
                  <Textarea
                    id="commentary"
                    name="commentary"
                    rows={4}
                    placeholder="Enter detailed commentary or explanation..."
                    defaultValue={editingVerse?.commentary || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    name="youtube_url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    defaultValue={editingVerse?.youtube_url || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={2}
                    defaultValue={editingVerse?.description || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    name="keywords"
                    placeholder="dharma, karma, devotion"
                    defaultValue={editingVerse?.keywords?.join(', ') || ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={editingVerse?.status || 'pending'}>
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
                    <Select name="visibility" defaultValue={editingVerse?.visibility || 'draft'}>
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
                    defaultChecked={editingVerse?.is_daily_verse || false}
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
                    defaultValue={editingVerse?.whatsapp_share_text || ''}
                  />
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
                    {editingVerse ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-sacred-cream/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search verses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <Select value={filterChapter} onValueChange={setFilterChapter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by chapter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Chapters</SelectItem>
              {chapters.map((chapter) => (
                <SelectItem key={chapter.id} value={chapter.id}>
                  {chapter.chapter_number}. {chapter.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Languages</SelectItem>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="uploaded">Uploaded</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Verses</TabsTrigger>
            <TabsTrigger value="grouped">By Chapter</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chapter</TableHead>
                  <TableHead>Verse</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Sanskrit</TableHead>
                  <TableHead>Translation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVerses.map((verse) => (
                  <TableRow key={verse.id}>
                    <TableCell>
                      {verse.chapters?.chapter_number}
                    </TableCell>
                    <TableCell className="font-medium">
                      {verse.verse_number}
                    </TableCell>
                    <TableCell>
                      {verse.languages?.name}
                    </TableCell>
                    <TableCell className="font-garamond max-w-xs truncate">
                      {verse.title || 'Untitled'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate font-garamond">
                      {verse.sanskrit_text || '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {verse.english_translation || '-'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          verse.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : verse.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : verse.status === 'uploaded'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {verse.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingVerse(verse);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(verse.id)}
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
          </TabsContent>

          <TabsContent value="grouped">
            <div className="space-y-6">
              {Object.entries(groupedVerses)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([chapterNum, chapterVerses]) => (
                  <Card key={chapterNum} className="border-sacred-gold/20">
                    <CardHeader>
                      <CardTitle className="text-lg font-cinzel text-saffron-800">
                        Chapter {chapterNum} - {chapterVerses[0]?.chapters?.title}
                      </CardTitle>
                      <CardDescription>
                        {chapterVerses.length} verses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {chapterVerses
                          .sort((a, b) => a.verse_number - b.verse_number)
                          .map((verse) => (
                            <div
                              key={verse.id}
                              className="flex justify-between items-center p-3 bg-white/50 rounded-lg border"
                            >
                              <div className="flex-1">
                                <div className="font-medium">
                                  Verse {verse.verse_number} - {verse.title || 'Untitled'}
                                </div>
                                <div className="text-sm text-gray-600 truncate">
                                  {verse.english_translation || 'No translation'}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    verse.status === 'published'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {verse.status}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingVerse(verse);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Verses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-saffron-800">
                    {verses.length}
                  </div>
                  <p className="text-sm text-gray-600">of 700 verses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Published Verses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {verses.filter(v => v.status === 'published').length}
                  </div>
                  <p className="text-sm text-gray-600">ready for public</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Chapters Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {Object.keys(groupedVerses).length}
                  </div>
                  <p className="text-sm text-gray-600">of 18 chapters</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {filteredVerses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No verses found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VersesManagement;
