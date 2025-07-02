
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Share2, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Verse {
  id: string;
  verse_number: number;
  sanskrit_text?: string;
  transliteration?: string;
  english_translation?: string;
  commentary?: string;
  youtube_url?: string;
  status: string;
  visibility: string;
  languages: { name: string; native_name: string };
}

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  sanskrit_title?: string;
  english_title?: string;
  total_verses?: number;
  summary?: string;
  description?: string;
}

const ChapterDetail = () => {
  const { chapterNumber } = useParams();
  const chapterNum = parseInt(chapterNumber || "1");
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapterData();
  }, [chapterNum]);

  const fetchChapterData = async () => {
    try {
      const [chapterResult, versesResult] = await Promise.all([
        supabase
          .from('chapters')
          .select('*')
          .eq('chapter_number', chapterNum)
          .eq('visibility', 'published')
          .single(),
        
        supabase
          .from('verses')
          .select(`
            *,
            chapters!inner (chapter_number),
            languages!inner (name, native_name)
          `)
          .eq('chapters.chapter_number', chapterNum)
          .eq('visibility', 'published')
          .eq('status', 'published')
          .order('verse_number')
      ]);

      if (chapterResult.data) {
        setChapter(chapterResult.data);
      }

      if (versesResult.data) {
        setVerses(versesResult.data as any);
      }
    } catch (error) {
      console.error('Error fetching chapter data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback sample data for Chapter 1
  const sampleChapterData = {
    1: {
      title: "Arjuna Vishada Yoga",
      english_title: "The Yoga of Arjuna's Dejection",
      description: "In this opening chapter, we witness Arjuna's moral crisis on the battlefield of Kurukshetra. Overwhelmed by the sight of his relatives, teachers, and friends assembled for war, Arjuna experiences profound grief and confusion about his duty as a warrior.",
      summary: "Arjuna's moral and emotional dilemma on the battlefield, setting the stage for Krishna's divine guidance.",
      verses: [
        {
          number: 1,
          sanskrit: "धृतराष्ट्र उवाच धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः। मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥",
          transliteration: "dhṛitarāśhtra uvācha dharma-kṣhetre kuru-kṣhetre samavetā yuyutsavaḥ māmakāḥ pāṇḍavāśh chaiva kim akurvata sañjaya",
          english: "Dhritarashtra said: O Sanjaya, after gathering on the holy field of Kurukshetra, and desiring to fight, what did my sons and the sons of Pandu do?",
          languages: ["English", "Hindi", "Telugu", "Tamil"]
        },
        {
          number: 2,
          sanskrit: "सञ्जय उवाच दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा। आचार्यमुपसङ्गम्य राजा वचनमब्रवीत्॥",
          transliteration: "sañjaya uvācha dṛiṣhṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanas tadā āchāryam upasaṅgamya rājā vachanam abravīt",
          english: "Sanjaya said: On seeing the Pandava army arranged in battle formation, King Duryodhana approached his teacher Drona, and spoke the following words.",
          languages: ["English", "Hindi", "Telugu", "Sanskrit"]
        },
        {
          number: 3,
          sanskrit: "पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम्। व्यूढां द्रुपदपुत्रेण तव शिष्येण धीमता॥",
          transliteration: "paśhyaitāṁ pāṇḍu-putrāṇām āchārya mahatīṁ chamūm vyūḍhāṁ drupada-putreṇa tava śhiṣhyeṇa dhīmatā",
          english: "Behold, O teacher, this mighty army of the sons of Pandu, arranged in battle formation by your intelligent disciple, the son of Drupada.",
          languages: ["English", "Hindi", "Tamil", "Malayalam"]
        }
      ]
    }
  };

  const displayChapter = chapter || sampleChapterData[chapterNum as keyof typeof sampleChapterData] || sampleChapterData[1];
  const displayVerses = verses.length > 0 ? verses : (displayChapter as any).verses || [];

  const shareVerse = (verseNumber: number) => {
    const url = `${window.location.origin}/chapter/${chapterNum}#verse-${verseNumber}`;
    const text = `Check out Chapter ${chapterNum}, Verse ${verseNumber} from Bhagavad Gita World`;
    
    if (navigator.share) {
      navigator.share({ title: text, url });
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/chapters">
            <Button variant="outline" className="border-saffron-200 hover:bg-saffron-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Chapters
            </Button>
          </Link>
          <div className="flex space-x-2">
            {chapterNum > 1 && (
              <Link to={`/chapter/${chapterNum - 1}`}>
                <Button variant="outline" size="sm" className="border-saffron-200 hover:bg-saffron-50">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {chapterNum < 18 && (
              <Link to={`/chapter/${chapterNum + 1}`}>
                <Button variant="outline" size="sm" className="border-saffron-200 hover:bg-saffron-50">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Chapter Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-sacred-glow">
            <span className="text-white font-cinzel font-bold text-2xl">{chapterNum}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-cinzel font-bold mb-4 sacred-text">
            {displayChapter.title}
          </h1>
          {(displayChapter as any).english_title && (
            <p className="text-xl text-saffron-700 font-garamond italic mb-6">
              {(displayChapter as any).english_title}
            </p>
          )}
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed font-garamond">
            {displayChapter.description || (displayChapter as any).summary}
          </p>
        </div>

        {/* Verses */}
        <div className="space-y-8">
          {displayVerses.length > 0 ? displayVerses.map((verse: any) => {
            const verseNumber = verse.verse_number || verse.number;
            const sanskritText = verse.sanskrit_text || verse.sanskrit;
            const transliteration = verse.transliteration;
            const englishTranslation = verse.english_translation || verse.english;
            const commentary = verse.commentary;
            const youtubeUrl = verse.youtube_url;
            const languages = verse.languages || ['English'];
            
            return (
              <Card key={verseNumber} id={`verse-${verseNumber}`} className="verse-card lotus-pattern">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sacred-gold to-saffron-500 rounded-full flex items-center justify-center text-white font-cinzel font-bold shadow-lg">
                        {verseNumber}
                      </div>
                      <div>
                        <span className="text-sm text-saffron-600 font-medium">
                          Chapter {chapterNum}, Verse {verseNumber}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareVerse(verseNumber)}
                      className="border-saffron-200 hover:bg-saffron-50"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sanskrit Text */}
                  {sanskritText && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-sacred-cream to-white rounded-lg border border-sacred-gold/20">
                      <p className="text-lg font-garamond text-gray-800 leading-relaxed mb-3">
                        {sanskritText}
                      </p>
                      {transliteration && (
                        <p className="text-sm text-saffron-600 italic">
                          {transliteration}
                        </p>
                      )}
                    </div>
                  )}

                  {/* English Translation */}
                  {englishTranslation && (
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed font-garamond text-lg">
                        {englishTranslation}
                      </p>
                    </div>
                  )}

                  {/* Commentary */}
                  {commentary && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Commentary</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {commentary}
                      </p>
                    </div>
                  )}

                  {/* Language Tags and Video */}
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(languages) ? languages.map((lang: any) => (
                          <Badge key={typeof lang === 'string' ? lang : lang.name} className="language-tag">
                            {typeof lang === 'string' ? lang : lang.name}
                          </Badge>
                        )) : (
                          <Badge className="language-tag">English</Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Video */}
                    <div className="w-full md:w-80">
                      {youtubeUrl ? (
                        <div className="aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${youtubeUrl.split('v=')[1]?.split('&')[0] || youtubeUrl}`}
                            className="w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-saffron-100 to-saffron-200 rounded-lg flex items-center justify-center border border-saffron-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                          <div className="text-center">
                            <Play className="w-12 h-12 text-saffron-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="text-saffron-700 font-garamond font-medium">
                              Watch Explanation
                            </p>
                            <p className="text-xs text-saffron-600">
                              English Commentary
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }) : (
            <div className="text-center py-12">
              <p className="text-gray-600 font-garamond">
                No verses available for this chapter yet. Check back later for updates.
              </p>
            </div>
          )}
        </div>

        {/* Chapter Navigation */}
        <div className="flex justify-between items-center mt-16 p-6 bg-white/60 rounded-xl border border-saffron-200">
          <div>
            {chapterNum > 1 && (
              <Link to={`/chapter/${chapterNum - 1}`}>
                <Button variant="outline" className="border-saffron-200 hover:bg-saffron-50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Button>
              </Link>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 font-garamond">
              Chapter {chapterNum} of 18
            </p>
          </div>
          <div>
            {chapterNum < 18 && (
              <Link to={`/chapter/${chapterNum + 1}`}>
                <Button className="sacred-button">
                  Next Chapter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail;
