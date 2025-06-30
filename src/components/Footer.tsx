
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-saffron-900 to-saffron-800 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-sacred-gold to-saffron-400 rounded-full flex items-center justify-center">
                <span className="om-symbol text-saffron-900 text-lg">ॐ</span>
              </div>
              <div>
                <h3 className="text-xl font-cinzel font-bold text-sacred-gold">
                  Bhagavad Gita World
                </h3>
                <p className="text-sm text-saffron-200">
                  Divine Wisdom in Every Language
                </p>
              </div>
            </div>
            <p className="text-saffron-100 leading-relaxed mb-4">
              Spreading the eternal wisdom of the Bhagavad Gita to every soul across the world. 
              Making sacred knowledge accessible through the power of language and devotion.
            </p>
            <p className="text-sm text-saffron-200 italic">
              "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।"<br />
              Whenever dharma declines, O Bharata, the divine manifests.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-cinzel font-semibold text-sacred-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/chapters" className="text-saffron-200 hover:text-white transition-colors">
                  All Chapters
                </Link>
              </li>
              <li>
                <Link to="/languages" className="text-saffron-200 hover:text-white transition-colors">
                  Languages
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-saffron-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-saffron-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-cinzel font-semibold text-sacred-gold mb-4">
              Support Our Mission
            </h4>
            <p className="text-saffron-200 text-sm mb-4">
              Help us continue spreading divine wisdom to every corner of the world.
            </p>
            <Link
              to="/donation"
              className="inline-flex items-center space-x-2 bg-sacred-gold text-saffron-900 px-4 py-2 rounded-full font-medium hover:bg-yellow-300 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Donate</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-saffron-700 mt-8 pt-8 text-center">
          <p className="text-saffron-200 text-sm">
            © 2024 Bhagavad Gita World. Made with devotion for humanity. 
            All sacred texts are in the public domain.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
