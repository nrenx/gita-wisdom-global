
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Filter } from "lucide-react";

const Languages = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const languages = [
    // Indian Languages
    { name: "Hindi", code: "hi", category: "indian", videos: 145, flag: "🇮🇳" },
    { name: "Telugu", code: "te", category: "indian", videos: 98, flag: "🇮🇳" },
    { name: "Tamil", code: "ta", category: "indian", videos: 87, flag: "🇮🇳" },
    { name: "Sanskrit", code: "sa", category: "indian", videos: 156, flag: "🇮🇳" },
    { name: "Bengali", code: "bn", category: "indian", videos: 76, flag: "🇮🇳" },
    { name: "Gujarati", code: "gu", category: "indian", videos: 63, flag: "🇮🇳" },
    { name: "Marathi", code: "mr", category: "indian", videos: 54, flag: "🇮🇳" },
    { name: "Punjabi", code: "pa", category: "indian", videos: 42, flag: "🇮🇳" },
    { name: "Kannada", code: "kn", category: "indian", videos: 38, flag: "🇮🇳" },
    { name: "Malayalam", code: "ml", category: "indian", videos: 35, flag: "🇮🇳" },
    { name: "Odia", code: "or", category: "indian", videos: 28, flag: "🇮🇳" },
    { name: "Assamese", code: "as", category: "indian", videos: 24, flag: "🇮🇳" },
    
    // International Languages
    { name: "English", code: "en", category: "international", videos: 189, flag: "🇺🇸" },
    { name: "Spanish", code: "es", category: "international", videos: 67, flag: "🇪🇸" },
    { name: "French", code: "fr", category: "international", videos: 45, flag: "🇫🇷" },
    { name: "German", code: "de", category: "international", videos: 38, flag: "🇩🇪" },
    { name: "Portuguese", code: "pt", category: "international", videos: 32, flag: "🇧🇷" },
    { name: "Russian", code: "ru", category: "international", videos: 29, flag: "🇷🇺" },
    { name: "Japanese", code: "ja", category: "international", videos: 26, flag: "🇯🇵" },
    { name: "Chinese", code: "zh", category: "international", videos: 24, flag: "🇨🇳" },
    { name: "Arabic", code: "ar", category: "international", videos: 21, flag: "🇸🇦" },
    { name: "Italian", code: "it", category: "international", videos: 18, flag: "🇮🇹" },
  ];

  const categories = [
    { id: "all", label: "All Languages", count: languages.length },
    { id: "indian", label: "Indian Languages", count: languages.filter(l => l.category === "indian").length },
    { id: "international", label: "International", count: languages.filter(l => l.category === "international").length },
  ];

  const filteredLanguages = selectedCategory === "all" 
    ? languages 
    : languages.filter(lang => lang.category === selectedCategory);

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
          {filteredLanguages.map((language) => (
            <Card key={language.code} className="chapter-card lotus-pattern group hover:animate-lotus-bloom cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{language.flag}</div>
                <h3 className="text-lg font-cinzel font-semibold mb-2 text-gray-800">
                  {language.name}
                </h3>
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
                    style={{ width: `${Math.min((language.videos / 189) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-garamond">
                  {Math.round((language.videos / 700) * 100)}% complete
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 p-8 bg-white/60 rounded-2xl border border-saffron-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-cinzel font-bold sacred-text mb-2">
                {languages.length}+
              </div>
              <p className="text-gray-700 font-garamond">Languages Available</p>
            </div>
            <div>
              <div className="text-3xl font-cinzel font-bold sacred-text mb-2">
                {languages.reduce((sum, lang) => sum + lang.videos, 0)}+
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
