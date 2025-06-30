
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Share2, Play } from "lucide-react";

const ChapterDetail = () => {
  const { chapterNumber } = useParams();
  const chapterNum = parseInt(chapterNumber || "1");

  // Sample data for Chapter 1
  const chapterData = {
    1: {
      title: "Arjuna Vishada Yoga",
      englishTitle: "The Yoga of Arjuna's Dejection",
      description: "In this opening chapter, we witness Arjuna's moral crisis on the battlefield of Kurukshetra. Overwhelmed by the sight of his relatives, teachers, and friends assembled for war, Arjuna experiences profound grief and confusion about his duty as a warrior.",
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

  const chapter = chapterData[chapterNum as keyof typeof chapterData] || chapterData[1];

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
            {chapter.title}
          </h1>
          <p className="text-xl text-saffron-700 font-garamond italic mb-6">
            {chapter.englishTitle}
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed font-garamond">
            {chapter.description}
          </p>
        </div>

        {/* Verses */}
        <div className="space-y-8">
          {chapter.verses.map((verse) => (
            <Card key={verse.number} id={`verse-${verse.number}`} className="verse-card lotus-pattern">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-sacred-gold to-saffron-500 rounded-full flex items-center justify-center text-white font-cinzel font-bold shadow-lg">
                      {verse.number}
                    </div>
                    <div>
                      <span className="text-sm text-saffron-600 font-medium">
                        Chapter {chapterNum}, Verse {verse.number}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareVerse(verse.number)}
                    className="border-saffron-200 hover:bg-saffron-50"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sanskrit Text */}
                <div className="mb-6 p-4 bg-gradient-to-r from-sacred-cream to-white rounded-lg border border-sacred-gold/20">
                  <p className="text-lg font-garamond text-gray-800 leading-relaxed mb-3">
                    {verse.sanskrit}
                  </p>
                  <p className="text-sm text-saffron-600 italic">
                    {verse.transliteration}
                  </p>
                </div>

                {/* English Translation */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed font-garamond text-lg">
                    {verse.english}
                  </p>
                </div>

                {/* Language Tags and Video */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {verse.languages.map((lang) => (
                        <Badge key={lang} className="language-tag">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Video Placeholder */}
                  <div className="w-full md:w-80">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
