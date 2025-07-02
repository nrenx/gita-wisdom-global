
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  sanskrit_title?: string;
  english_title?: string;
  total_verses?: number;
  summary?: string;
  description?: string;
  visibility: string;
}

const Chapters = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('visibility', 'published')
        .order('chapter_number');

      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data for display purposes (will be populated from database)
  const defaultChapters = [
    {
      number: 1,
      title: "Arjuna Vishada Yoga",
      englishTitle: "The Yoga of Arjuna's Dejection",
      verses: 47,
      description: "Arjuna's moral and emotional dilemma on the battlefield, setting the stage for Krishna's divine guidance.",
      theme: "Crisis and Calling"
    },
    {
      number: 2,
      title: "Sankhya Yoga",
      englishTitle: "The Yoga of Knowledge",
      verses: 72,
      description: "Krishna introduces the fundamental concepts of the soul, duty, and the path of knowledge.",
      theme: "Soul and Duty"
    },
    {
      number: 3,
      title: "Karma Yoga",
      englishTitle: "The Yoga of Action",
      verses: 43,
      description: "The path of selfless action and the importance of performing one's duty without attachment.",
      theme: "Selfless Action"
    },
    {
      number: 4,
      title: "Jnana Karma Sanyasa Yoga",
      englishTitle: "The Yoga of Knowledge and Action",
      verses: 42,
      description: "The relationship between knowledge, action, and renunciation in spiritual practice.",
      theme: "Knowledge in Action"
    },
    {
      number: 5,
      title: "Karma Sanyasa Yoga",
      englishTitle: "The Yoga of Renunciation of Action",
      verses: 29,
      description: "True renunciation and the unity of action and meditation paths.",
      theme: "True Renunciation"
    },
    {
      number: 6,
      title: "Dhyana Yoga",
      englishTitle: "The Yoga of Meditation",
      verses: 47,
      description: "The practice of meditation, self-discipline, and achieving inner balance.",
      theme: "Meditation Practice"
    },
    {
      number: 7,
      title: "Jnana Vijnana Yoga",
      englishTitle: "The Yoga of Knowledge and Realization",
      verses: 30,
      description: "Krishna reveals His divine nature and the different paths souls take toward Him.",
      theme: "Divine Knowledge"
    },
    {
      number: 8,
      title: "Aksara Brahma Yoga",
      englishTitle: "The Yoga of the Imperishable Brahman",
      verses: 28,
      description: "The nature of the Supreme, the individual soul, and the cosmic principles.",
      theme: "Eternal Principles"
    },
    {
      number: 9,
      title: "Raja Vidya Raja Guhya Yoga",
      englishTitle: "The Yoga of Royal Knowledge and Royal Secret",
      verses: 34,
      description: "The most sacred and royal knowledge about devotion and divine grace.",
      theme: "Sacred Devotion"
    },
    {
      number: 10,
      title: "Vibhuti Yoga",
      englishTitle: "The Yoga of Divine Manifestations",
      verses: 42,
      description: "Krishna describes His divine manifestations and glories throughout creation.",
      theme: "Divine Glory"
    },
    {
      number: 11,
      title: "Visvarupa Darshana Yoga",
      englishTitle: "The Yoga of the Vision of the Universal Form",
      verses: 55,
      description: "Arjuna witnesses Krishna's cosmic form, revealing the universal divine presence.",
      theme: "Cosmic Vision"
    },
    {
      number: 12,
      title: "Bhakti Yoga",
      englishTitle: "The Yoga of Devotion",
      verses: 20,
      description: "The supreme path of loving devotion and surrender to the Divine.",
      theme: "Pure Devotion"
    },
    {
      number: 13,
      title: "Ksetra Ksetrajna Vibhaga Yoga",
      englishTitle: "The Yoga of the Field and the Knower of the Field",
      verses: 35,
      description: "The distinction between the body-mind complex and the conscious soul within.",
      theme: "Consciousness"
    },
    {
      number: 14,
      title: "Gunatraya Vibhaga Yoga",
      englishTitle: "The Yoga of the Three Modes of Nature",
      verses: 27,
      description: "Understanding the three modes of material nature and transcending them.",
      theme: "Natural Modes"
    },
    {
      number: 15,
      title: "Purusottama Yoga",
      englishTitle: "The Yoga of the Supreme Person",
      verses: 20,
      description: "Krishna reveals Himself as the Supreme Person beyond the perishable and imperishable.",
      theme: "Supreme Being"
    },
    {
      number: 16,
      title: "Daivasura Sampad Vibhaga Yoga",
      englishTitle: "The Yoga of Divine and Demonic Natures",
      verses: 24,
      description: "The characteristics of divine and demonic natures in human behavior.",
      theme: "Divine vs Demonic"
    },
    {
      number: 17,
      title: "Sraddhatraya Vibhaga Yoga",
      englishTitle: "The Yoga of the Three Types of Faith",
      verses: 28,
      description: "The three types of faith and their corresponding worship, food, and sacrifice.",
      theme: "Types of Faith"
    },
    {
      number: 18,
      title: "Moksa Sanyasa Yoga",
      englishTitle: "The Yoga of Liberation through Renunciation",
      verses: 78,
      description: "The culmination of all teachings, emphasizing complete surrender and liberation.",
      theme: "Final Liberation"
    }
  ];

  const displayChapters = chapters.length > 0 ? chapters : defaultChapters;

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-sacred-glow">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 sacred-text">
            18 Sacred Chapters
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-garamond leading-relaxed">
            Embark on a transformative journey through the complete Bhagavad Gita. 
            Each chapter reveals profound wisdom for navigating life's challenges with divine guidance.
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayChapters.map((chapter) => {
            const chapterNumber = 'chapter_number' in chapter ? chapter.chapter_number : chapter.number;
            const chapterTitle = 'title' in chapter ? chapter.title : chapter.title;
            const englishTitle = 'english_title' in chapter ? chapter.english_title : chapter.englishTitle;
            const verses = 'total_verses' in chapter ? chapter.total_verses : chapter.verses;
            const description = 'description' in chapter ? chapter.description : chapter.description;
            const theme = 'theme' in chapter ? chapter.theme : null;
            
            return (
              <Card key={chapterNumber} className="chapter-card lotus-pattern group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-full flex items-center justify-center text-white font-cinzel font-bold shadow-lg">
                        {chapterNumber}
                      </div>
                      <div>
                        <span className="text-sm text-saffron-600 font-medium">Chapter {chapterNumber}</span>
                        <div className="text-xs text-gray-500">{verses || 0} verses</div>
                      </div>
                    </div>
                    {theme && (
                      <span className="language-tag text-xs">
                        {theme}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-cinzel font-semibold mb-2 text-gray-800 line-clamp-2">
                    {chapterTitle}
                  </h3>
                  {englishTitle && (
                    <p className="text-sm text-saffron-700 font-medium mb-3 italic">
                      {englishTitle}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-garamond">
                    {description}
                  </p>

                  <Link to={`/chapter/${chapterNumber}`}>
                    <Button className="w-full sacred-button group-hover:shadow-lg transition-all duration-300">
                      <span>Explore Chapter</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-white/60 rounded-2xl border border-saffron-200">
          <h2 className="text-2xl font-cinzel font-bold mb-4 sacred-text">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-gray-700 mb-6 font-garamond">
            Start with Chapter 1 and let the eternal wisdom guide your path to self-realization.
          </p>
          <Link to="/chapter/1">
            <Button className="sacred-button">
              Start with Chapter 1: Arjuna's Dilemma
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Chapters;
