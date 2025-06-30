
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Crown, Gift, CreditCard, Banknote } from "lucide-react";

const Donation = () => {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];

  const impactLevels = [
    {
      icon: Heart,
      title: "Devotee",
      amount: 10,
      impact: "Helps translate 1 verse into a new language",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Star,
      title: "Supporter", 
      amount: 25,
      impact: "Sponsors video creation for 2-3 verses",
      color: "from-saffron-500 to-saffron-600"
    },
    {
      icon: Crown,
      title: "Guardian",
      amount: 100,
      impact: "Funds complete chapter translation project",
      color: "from-sacred-gold to-yellow-600"
    },
    {
      icon: Gift,
      title: "Benefactor",
      amount: 250,
      impact: "Supports entire language addition to platform",
      color: "from-sacred-divine to-purple-600"
    }
  ];

  const handleDonate = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    // Here you would integrate with payment gateway
    console.log(`Donating $${amount} ${frequency === "monthly" ? "monthly" : "once"}`);
    // For demo purposes, showing alert
    alert(`Thank you for your generous donation of $${amount}! In a real implementation, this would process the payment.`);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-sacred-gold to-saffron-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-sacred-glow">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 sacred-text">
            Support Sacred Wisdom
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-garamond leading-relaxed">
            Your generous donation helps us continue our mission of making the Bhagavad Gita's 
            divine wisdom accessible to every soul, in every language, completely free.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Donation Form */}
          <div>
            <Card className="verse-card lotus-pattern">
              <CardContent className="p-8">
                <h2 className="text-2xl font-cinzel font-bold mb-6 sacred-text">
                  Make a Donation
                </h2>

                {/* Frequency Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-garamond">
                    Donation Frequency
                  </label>
                  <div className="flex gap-3">
                    <Button
                      variant={frequency === "once" ? "default" : "outline"}
                      onClick={() => setFrequency("once")}
                      className={frequency === "once" ? "sacred-button" : "border-saffron-200 hover:bg-saffron-50"}
                    >
                      One-time
                    </Button>
                    <Button
                      variant={frequency === "monthly" ? "default" : "outline"}
                      onClick={() => setFrequency("monthly")}
                      className={frequency === "monthly" ? "sacred-button" : "border-saffron-200 hover:bg-saffron-50"}
                    >
                      Monthly
                    </Button>
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-garamond">
                    Donation Amount (USD)
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        className={`${
                          selectedAmount === amount && !customAmount
                            ? "sacred-button"
                            : "border-saffron-200 hover:bg-saffron-50"
                        } text-lg font-semibold`}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      className="w-full px-4 py-3 border border-saffron-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 font-garamond"
                    />
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                  </div>
                </div>

                {/* Current Selection Display */}
                <div className="mb-6 p-4 bg-gradient-to-r from-sacred-cream to-white rounded-lg border border-sacred-gold/20">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-garamond">You are donating</p>
                    <p className="text-2xl font-cinzel font-bold sacred-text">
                      ${customAmount || selectedAmount}
                      {frequency === "monthly" && <span className="text-lg"> /month</span>}
                    </p>
                  </div>
                </div>

                {/* Donation Button */}
                <Button 
                  onClick={handleDonate}
                  className="w-full sacred-button text-lg py-4"
                  disabled={!selectedAmount && !customAmount}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Donate with Love
                </Button>

                {/* Payment Methods */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-3 font-garamond">Secure payment via</p>
                  <div className="flex justify-center space-x-4 text-gray-500">
                    <CreditCard className="h-6 w-6" />
                    <Banknote className="h-6 w-6" />
                    <span className="text-sm font-medium">PayPal • Stripe • Razorpay</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Levels */}
          <div>
            <h2 className="text-2xl font-cinzel font-bold mb-6 sacred-text">
              Your Impact
            </h2>
            <div className="space-y-4">
              {impactLevels.map((level, index) => (
                <Card key={index} className="chapter-card lotus-pattern group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${level.color} rounded-full flex items-center justify-center shrink-0 shadow-lg`}>
                        <level.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-cinzel font-semibold text-gray-800">
                            {level.title}
                          </h3>
                          <Badge className="language-tag">
                            ${level.amount}+
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-garamond">
                          {level.impact}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <Card className="verse-card lotus-pattern mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-cinzel font-semibold mb-4 text-gray-800">
                  How Your Donation Helps
                </h3>
                <ul className="space-y-3 text-gray-600 font-garamond">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-saffron-500 rounded-full mt-2 shrink-0"></span>
                    <span>Translation and localization into new languages</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-saffron-500 rounded-full mt-2 shrink-0"></span>
                    <span>High-quality video production and editing</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-saffron-500 rounded-full mt-2 shrink-0"></span>
                    <span>Platform development and maintenance</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-saffron-500 rounded-full mt-2 shrink-0"></span>
                    <span>Supporting scholars and spiritual teachers</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-saffron-500 rounded-full mt-2 shrink-0"></span>
                    <span>Keeping all content completely free for everyone</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gratitude Section */}
        <div className="mt-16 text-center">
          <Card className="verse-card lotus-pattern">
            <CardContent className="p-8">
              <h2 className="text-2xl font-cinzel font-bold mb-4 sacred-text">
                🙏 Gratitude from Our Hearts
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-gray-700 mb-6 font-garamond text-lg leading-relaxed">
                  Every donation, no matter the size, is received with immense gratitude. You are not just 
                  supporting a platform – you are participating in a sacred mission to awaken consciousness 
                  and spread divine wisdom across the world.
                </p>
                <div className="text-center">
                  <p className="text-saffron-700 font-cinzel italic text-xl mb-2">
                    "दानं पवित्रं च महत् फलं च"
                  </p>
                  <p className="text-saffron-600">
                    Giving is sacred and brings great fruit
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

export default Donation;
