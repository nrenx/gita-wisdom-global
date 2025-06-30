
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Languages, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, canEdit } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-saffron-800 mb-6 animate-lotus-bloom">
              🕉️ Bhagavad Gita World
            </h1>
            <p className="text-xl md:text-2xl font-garamond text-saffron-700 mb-8 max-w-3xl mx-auto">
              Experience the sacred wisdom of Bhagavad Gita through verse-by-verse video explanations in all major Indian and global languages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-saffron-600 hover:bg-saffron-700 text-white px-8 py-3 rounded-full font-medium animate-sacred-glow">
                <Link to="/chapters">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Chapters
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-saffron-600 text-saffron-600 hover:bg-saffron-50 px-8 py-3 rounded-full font-medium">
                <Link to="/languages">
                  <Languages className="mr-2 h-5 w-5" />
                  Choose Language
                </Link>
              </Button>
              {canEdit && (
                <Button asChild variant="outline" size="lg" className="border-sacred-gold text-sacred-gold hover:bg-sacred-gold/10 px-8 py-3 rounded-full font-medium">
                  <Link to="/admin">
                    Admin Panel
                  </Link>
                </Button>
              )}
              {!user && (
                <Button asChild variant="outline" size="lg" className="border-saffron-400 text-saffron-600 hover:bg-saffron-50 px-8 py-3 rounded-full font-medium">
                  <Link to="/auth">
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-cinzel font-bold text-saffron-800 mb-4">
              Divine Wisdom, Universal Access
            </h2>
            <p className="text-lg font-garamond text-saffron-600 max-w-2xl mx-auto">
              Breaking language barriers to share the timeless teachings of Lord Krishna
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-divine-gradient border-sacred-gold/20 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <BookOpen className="h-12 w-12 text-saffron-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-cinzel text-saffron-800">18 Sacred Chapters</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center font-garamond text-gray-700">
                  Complete coverage of all 18 chapters with detailed verse-by-verse explanations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-divine-gradient border-sacred-gold/20 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <Languages className="h-12 w-12 text-saffron-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-cinzel text-saffron-800">Multiple Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center font-garamond text-gray-700">
                  Available in Hindi, Telugu, Tamil, English, and many more Indian regional languages
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-divine-gradient border-sacred-gold/20 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-saffron-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-cinzel text-saffron-800">Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center font-garamond text-gray-700">
                  Spreading the universal message of dharma and devotion across cultures worldwide
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-sacred-gold/30">
            <CardContent className="p-8">
              <Heart className="h-12 w-12 text-saffron-600 mx-auto mb-4" />
              <h3 className="text-2xl font-cinzel font-bold text-saffron-800 mb-4">
                Support Our Mission
              </h3>
              <p className="font-garamond text-gray-700 mb-6">
                Help us continue sharing these sacred teachings freely with the world
              </p>
              <Button asChild className="bg-saffron-600 hover:bg-saffron-700 text-white">
                <Link to="/donation">Make a Donation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
