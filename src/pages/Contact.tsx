
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageCircle, BookOpen, Heart } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactReasons = [
    {
      icon: BookOpen,
      title: "Content Suggestions",
      description: "Suggest new languages, teachers, or specific verses you'd like to see explained."
    },
    {
      icon: MessageCircle,
      title: "General Inquiry",
      description: "Ask questions about our mission, content, or how you can get involved."
    },
    {
      icon: Heart,
      title: "Volunteer Opportunities",
      description: "Join our team as a translator, content creator, or community moderator."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-sacred-divine to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-sacred-glow">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 sacred-text">
            Connect With Us
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-garamond leading-relaxed">
            We're here to listen, help, and walk this spiritual journey together. 
            Reach out with your questions, suggestions, or simply to share your experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="verse-card lotus-pattern">
              <CardContent className="p-8">
                <h2 className="text-2xl font-cinzel font-bold mb-6 sacred-text">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-garamond">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-saffron-200 focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-garamond">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-saffron-200 focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 font-garamond">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="border-saffron-200 focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="What would you like to discuss?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 font-garamond">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="border-saffron-200 focus:ring-saffron-500 focus:border-saffron-500 resize-none"
                      placeholder="Share your thoughts, questions, or suggestions..."
                    />
                  </div>

                  <Button type="submit" className="w-full sacred-button text-lg py-3">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Reasons */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card className="chapter-card lotus-pattern">
              <CardContent className="p-8">
                <h2 className="text-2xl font-cinzel font-bold mb-6 sacred-text">
                  Get In Touch
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-cinzel font-semibold text-gray-800 mb-1">Email Us</h3>
                      <p className="text-gray-600 font-garamond">hello@bhagavadgitaworld.org</p>
                      <p className="text-sm text-gray-500 font-garamond">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sacred-divine to-purple-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-cinzel font-semibold text-gray-800 mb-1">Call Us</h3>
                      <p className="text-gray-600 font-garamond">+1 (555) 123-GITA</p>
                      <p className="text-sm text-gray-500 font-garamond">Monday - Friday, 9 AM - 6 PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sacred-gold to-yellow-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-cinzel font-semibold text-gray-800 mb-1">Visit Us</h3>
                      <p className="text-gray-600 font-garamond">
                        Sacred Grove Ashram<br />
                        123 Dharma Path<br />
                        Rishikesh, Uttarakhand, India
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Reasons */}
            <div>
              <h2 className="text-xl font-cinzel font-bold mb-6 sacred-text">
                Why People Contact Us
              </h2>
              <div className="space-y-4">
                {contactReasons.map((reason, index) => (
                  <Card key={index} className="verse-card lotus-pattern">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                          <reason.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-cinzel font-semibold text-gray-800 mb-2">
                            {reason.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed font-garamond">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="verse-card lotus-pattern">
            <CardContent className="p-8">
              <h2 className="text-2xl font-cinzel font-bold mb-6 sacred-text text-center">
                Frequently Asked Questions
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-cinzel font-semibold text-gray-800 mb-2">
                    How can I request a new language?
                  </h3>
                  <p className="text-gray-600 font-garamond mb-4">
                    Simply reach out to us with your language request. We prioritize languages based on community demand and available translators.
                  </p>
                </div>
                <div>
                  <h3 className="font-cinzel font-semibold text-gray-800 mb-2">
                    Can I contribute translations?
                  </h3>
                  <p className="text-gray-600 font-garamond mb-4">
                    Absolutely! We welcome qualified translators and spiritual scholars to join our mission. Contact us with your background and language expertise.
                  </p>
                </div>
                <div>
                  <h3 className="font-cinzel font-semibold text-gray-800 mb-2">
                    Is all content really free?
                  </h3>
                  <p className="text-gray-600 font-garamond mb-4">
                    Yes! We believe sacred wisdom should never be behind a paywall. Everything is free and will always remain so.
                  </p>
                </div>
                <div>
                  <h3 className="font-cinzel font-semibold text-gray-800 mb-2">
                    How do you ensure translation accuracy?
                  </h3>
                  <p className="text-gray-600 font-garamond mb-4">
                    All translations are reviewed by qualified Sanskrit scholars and native speakers to maintain authenticity and cultural sensitivity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
