
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Globe, Heart, Play } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "18 Sacred Chapters",
      description: "Complete verse-by-verse explanations of all 18 chapters of the Bhagavad Gita",
      color: "from-saffron-500 to-saffron-600"
    },
    {
      icon: Globe,
      title: "Multiple Languages",
      description: "Experience divine wisdom in Hindi, English, Telugu, Tamil, Sanskrit and more",
      color: "from-sacred-divine to-purple-600"
    },
    {
      icon: Play,
      title: "Video Explanations",
      description: "High-quality YouTube video explanations by renowned spiritual teachers",
      color: "from-sacred-gold to-yellow-600"
    },
    {
      icon: Heart,
      title: "Free for All",
      description: "Sacred knowledge should be accessible to everyone, everywhere, always",
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-divine-gradient opacity-50"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-lotus-bloom">
                <span className="om-symbol text-white text-4xl">ॐ</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-cinzel font-bold mb-6 text-balance">
                <span className="sacred-text">Divine Wisdom</span><br />
                <span className="text-gray-800">in Every Language</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 font-garamond leading-relaxed">
                Experience the eternal teachings of the Bhagavad Gita through beautiful video explanations
                in all major Indian and global languages. Let ancient wisdom guide your modern life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/chapters">
                <Button className="sacred-button text-lg px-8 py-4">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Chapters
                </Button>
              </Link>
              <Link to="/languages">
                <Button variant="outline" className="border-2 border-saffron-500 text-saffron-700 hover:bg-saffron-50 text-lg px-8 py-4 font-cinzel font-semibold">
                  <Globe className="mr-2 h-5 w-5" />
                  Choose Language
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-lg text-saffron-800 font-garamond italic mb-2">
                "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।"
              </p>
              <p className="text-saffron-600 font-medium">
                You have the right to perform your actions, but never to the fruits of action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6 sacred-text">
              Sacred Features
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-garamond">
              Discover how we're making the timeless wisdom of the Gita accessible to souls worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="chapter-card lotus-pattern group hover:animate-lotus-bloom">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-cinzel font-semibold mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-garamond">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Chapter Preview */}
      <section className="py-20 px-4 bg-white/60">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6 sacred-text">
              Sample Chapter
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-garamond">
              Experience a glimpse of Chapter 1: Arjuna's Dilemma
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="verse-card overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="language-tag">English</span>
                      <span className="language-tag">Chapter 1, Verse 1</span>
                    </div>
                    <h3 className="text-2xl font-cinzel font-semibold mb-4 text-gray-800">
                      Dhritarashtra's Inquiry
                    </h3>
                    <p className="text-gray-700 font-garamond italic mb-4 text-lg leading-relaxed">
                      "धृतराष्ट्र उवाच धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।"
                    </p>
                    <p className="text-gray-600 font-garamond leading-relaxed">
                      Dhritarashtra said: O Sanjaya, after gathering on the holy field of Kurukshetra, 
                      and desiring to fight, what did my sons and the sons of Pandu do?
                    </p>
                  </div>
                  <div className="w-full md:w-80">
                    <div className="aspect-video bg-gradient-to-br from-saffron-100 to-saffron-200 rounded-lg flex items-center justify-center border border-saffron-300">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-saffron-600 mx-auto mb-4" />
                        <p className="text-saffron-700 font-garamond">
                          Video Explanation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/chapter/1">
              <Button className="sacred-button text-lg px-8 py-4">
                View Complete Chapter 1
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6 sacred-text">
              Begin Your Sacred Journey
            </h2>
            <p className="text-xl text-gray-700 mb-8 font-garamond leading-relaxed">
              Join millions of souls worldwide who have found peace, purpose, and divine guidance 
              through the eternal wisdom of the Bhagavad Gita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chapters">
                <Button className="sacred-button text-lg px-8 py-4">
                  Start with Chapter 1
                </Button>
              </Link>
              <Link to="/donation">
                <Button variant="outline" className="border-2 border-saffron-500 text-saffron-700 hover:bg-saffron-50 text-lg px-8 py-4 font-cinzel font-semibold">
                  <Heart className="mr-2 h-5 w-5" />
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
