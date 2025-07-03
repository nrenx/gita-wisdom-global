
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Language {
  id: string;
  name: string;
  code: string;
  native_name?: string;
  is_active: boolean;
  manual_verse_count?: number;
  manual_chapter_count?: number;
}

const Languages = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setLanguages(data || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Failed to load languages');
    } finally {
      setLoading(false);
    }
  };

  // Categorize languages (Indian vs International based on common language codes)
  const getLanguageCategory = (code: string) => {
    const indianLanguages = ['hi', 'te', 'ta', 'sa', 'bn', 'gu', 'mr', 'pa', 'kn', 'ml', 'or', 'as'];
    return indianLanguages.includes(code) ? 'indian' : 'international';
  };

  const getLanguageFlag = (code: string) => {
    const flagMap: Record<string, string> = {
      'hi': '🇮🇳', 'te': '🇮🇳', 'ta': '🇮🇳', 'sa': '🇮🇳', 'bn': '🇮🇳', 'gu': '🇮🇳',
      'mr': '🇮🇳', 'pa': '🇮🇳', 'kn': '🇮🇳', 'ml': '🇮🇳', 'or': '🇮🇳', 'as': '🇮🇳',
      'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'pt': '🇧🇷', 'ru': '🇷🇺',
      'ja': '🇯🇵', 'zh': '🇨🇳', 'ar': '🇸🇦', 'it': '🇮🇹'
    };
    return flagMap[code] || '🌐';
  };

  const languagesWithCategory = languages.map(lang => ({
    ...lang,
    category: getLanguageCategory(lang.code),
    flag: getLanguageFlag(lang.code),
    videos: lang.manual_verse_count || 0
  }));

  const categories = [
    { id: "all", label: "All Languages", count: languagesWithCategory.length },
    { id: "indian", label: "Indian Languages", count: languagesWithCategory.filter(l => l.category === "indian").length },
    { id: "international", label: "International", count: languagesWithCategory.filter(l => l.category === "international").length },
  ];

  const filteredLanguages = selectedCategory === "all" 
    ? languagesWithCategory 
    : languagesWithCategory.filter(lang => lang.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sacred-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-sacred-divine to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-sacred-glow">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 sacred-text">
            Divine Languages
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-garamond leading-relaxed">
            Experience the Bhagavad Gita in your native language. Sacred wisdom transcends all boundaries,
            speaking directly to every soul in their mother tongue.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id 
                  ? "sacred-button" 
                  : "border-saffron-200 hover:bg-saffron-50 text-saffron-700"
              } transition-all duration-300`}
            >
              <Filter className="mr-2 h-4 w-4" />
              {category.label}
              <Badge variant="secondary" className="ml-2 bg-white/70">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Languages Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((language) => (
              <Card key={language.code} className="chapter-card lotus-pattern group hover:animate-lotus-bloom cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{language.flag}</div>
                  <h3 className="text-lg font-cinzel font-semibold mb-2 text-gray-800">
                    {language.name}
                  </h3>
                  {language.native_name && (
                    <p className="text-sm text-gray-600 mb-3 font-garamond">
                      {language.native_name}
                    </p>
                  )}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Badge className="language-tag">
                      {language.videos} videos
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {language.category}
                    </Badge>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-saffron-500 to-saffron-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((language.videos / 700) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-garamond">
                    {Math.round((language.videos / 700) * 100)}% complete
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 font-garamond">
                No languages found. Please add languages in the admin panel.
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 p-8 bg-white/60 rounded-2xl border border-saffron-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-cinzel font-bold sacred-text mb-2">
                {languagesWithCategory.length}
              </div>
              <p className="text-gray-700 font-garamond">Languages Available</p>
            </div>
            <div>
              <div className="text-3xl font-cinzel font-bold sacred-text mb-2">
                {languagesWithCategory.reduce((sum, lang) => sum + (lang.videos || 0), 0)}
              </div>
              <p className="text-gray-700 font-garamond">Total Video Explanations</p>
            </div>
            <div>
              <div className="text-3xl font-cinzel font-bold sacred-text mb-2">
                700
              </div>
              <p className="text-gray-700 font-garamond">Total Verses</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-cinzel font-bold mb-4 sacred-text">
            Don't See Your Language?
          </h2>
          <p className="text-gray-700 mb-6 font-garamond max-w-2xl mx-auto">
            We're constantly adding new languages to make the Gita accessible to everyone. 
            Let us know which language you'd like to see next!
          </p>
          <Button className="sacred-button">
            Request a Language
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Languages;
