
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Globe, Book } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Divine Love",
      description: "We believe sacred knowledge should flow freely to every soul, transcending all barriers of language, culture, and geography."
    },
    {
      icon: Users,
      title: "Universal Brotherhood",
      description: "The Gita teaches us that all beings are connected. Our mission unites humanity through shared spiritual wisdom."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Making ancient Indian wisdom accessible to the modern world through technology and multilingual content."
    },
    {
      icon: Book,
      title: "Authentic Teachings",
      description: "We maintain the highest standards of accuracy and authenticity in all our translations and explanations."
    }
  ];

  const team = [
    {
      name: "Swami Krishnananda",
      role: "Spiritual Guide & Sanskrit Scholar",
      description: "40+ years of Gita study and teaching across India and internationally."
    },
    {
      name: "Dr. Priya Sharma",
      role: "Translation Director",
      description: "PhD in Comparative Religion, fluent in 12 languages, specializing in spiritual texts."
    },
    {
      name: "Rajesh Kumar",
      role: "Technology Lead",
      description: "Former software engineer turned spiritual seeker, building bridges between technology and dharma."
    },
    {
      name: "Sister Maria",
      role: "International Outreach",
      description: "Connecting diverse communities worldwide through the universal message of the Gita."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-sacred-gold to-saffron-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-sacred-glow">
            <span className="om-symbol text-white text-xl">ॐ</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 sacred-text">
            Our Sacred Mission
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-garamond leading-relaxed">
            Bhagavad Gita World was born from a simple yet profound vision: to make the timeless wisdom 
            of the Gita accessible to every soul on Earth, in their own language, in their own way.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <Card className="verse-card lotus-pattern">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-cinzel font-bold mb-8 sacred-text text-center">
                  Our Story
                </h2>
                <div className="space-y-6 text-gray-700 font-garamond text-lg leading-relaxed">
                  <p>
                    In 2020, during the global pause brought by the pandemic, a small group of spiritual seekers 
                    came together with a shared realization: millions of people worldwide were searching for meaning, 
                    peace, and guidance, yet the profound wisdom of the Bhagavad Gita remained locked away in 
                    ancient Sanskrit, accessible only to scholars and those fortunate enough to find authentic teachers.
                  </p>
                  <p>
                    We saw grandmothers in rural villages who could benefit from Krishna's teachings but couldn't 
                    access them in their native tongue. We met young professionals in global cities, hungry for 
                    spiritual guidance but struggling with archaic translations. We encountered souls from every 
                    continent, all seeking the same eternal truths.
                  </p>
                  <p>
                    This is how Bhagavad Gita World was born – not as a business, but as a seva (service) to humanity. 
                    Our mission is simple: break down every barrier between a seeking soul and the divine wisdom of 
                    the Gita. Language, geography, technology, cost – nothing should stand in the way of spiritual awakening.
                  </p>
                  <div className="text-center my-8">
                    <p className="text-saffron-700 font-cinzel italic text-xl">
                      "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
                    </p>
                    <p className="text-saffron-600 mt-2">
                      May all beings be happy, may all beings be free from illness
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-cinzel font-bold mb-12 sacred-text text-center">
            Our Sacred Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="chapter-card lotus-pattern group">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-cinzel font-semibold mb-3 text-gray-800">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed font-garamond">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-cinzel font-bold mb-12 sacred-text text-center">
            Our Devoted Team
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="verse-card lotus-pattern">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-sacred-divine to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-cinzel font-bold shadow-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-xl font-cinzel font-semibold mb-2 text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-saffron-600 font-medium mb-4 font-garamond">
                      {member.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed font-garamond">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <Card className="verse-card lotus-pattern">
            <CardContent className="p-8">
              <h2 className="text-2xl font-cinzel font-bold mb-8 sacred-text text-center">
                Our Impact So Far
              </h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-cinzel font-bold sacred-text mb-2">2M+</div>
                  <p className="text-gray-700 font-garamond">Souls Reached</p>
                </div>
                <div>
                  <div className="text-3xl font-cinzel font-bold sacred-text mb-2">25+</div>
                  <p className="text-gray-700 font-garamond">Languages</p>
                </div>
                <div>
                  <div className="text-3xl font-cinzel font-bold sacred-text mb-2">700+</div>
                  <p className="text-gray-700 font-garamond">Video Explanations</p>
                </div>
                <div>
                  <div className="text-3xl font-cinzel font-bold sacred-text mb-2">150+</div>
                  <p className="text-gray-700 font-garamond">Countries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="verse-card lotus-pattern">
            <CardContent className="p-8">
              <h2 className="text-2xl font-cinzel font-bold mb-4 sacred-text">
                Join Our Sacred Mission
              </h2>
              <p className="text-gray-700 mb-6 font-garamond max-w-2xl mx-auto">
                Whether through spreading the word, contributing translations, or supporting our work financially, 
                every soul can help make divine wisdom accessible to all.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="sacred-button inline-block px-8 py-3 rounded-full text-center">
                  Get Involved
                </a>
                <a href="/donation" className="border-2 border-saffron-500 text-saffron-700 hover:bg-saffron-50 px-8 py-3 rounded-full font-cinzel font-semibold transition-colors inline-block text-center">
                  Support Our Work
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
