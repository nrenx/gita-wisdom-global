
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Chapters", path: "/chapters" },
    { name: "Languages", path: "/languages" },
    { name: "About", path: "/about" },
    { name: "Donation", path: "/donation" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-saffron-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 animate-sacred-glow">
              <span className="om-symbol text-white text-xl">ॐ</span>
            </div>
            <div>
              <h1 className="text-2xl font-cinzel font-bold sacred-text">
                Bhagavad Gita World
              </h1>
              <p className="text-sm text-saffron-600 font-garamond">
                Divine Wisdom in Every Language
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-garamond font-medium transition-all duration-300 hover:text-saffron-600 relative ${
                  isActive(item.path)
                    ? "text-saffron-600"
                    : "text-gray-700"
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-saffron-500 to-saffron-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Search Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center space-x-2 border-saffron-200 hover:bg-saffron-50"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-saffron-200 pt-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-garamond font-medium transition-all duration-300 hover:text-saffron-600 py-2 px-3 rounded-lg ${
                    isActive(item.path)
                      ? "text-saffron-600 bg-saffron-50"
                      : "text-gray-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="self-start mt-2 border-saffron-200 hover:bg-saffron-50"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
