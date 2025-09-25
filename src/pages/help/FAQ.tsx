import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const FAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Sign Up' button on the homepage and fill in your details. You'll receive a confirmation email to activate your account."
        },
        {
          question: "Is there a free trial available?",
          answer: "Yes! New users get a 14-day free trial with full access to all features. No credit card required."
        }
      ]
    },
    {
      category: "Features & Functionality",
      questions: [
        {
          question: "How does the crop health analysis work?",
          answer: "Our AI-powered system analyzes spectral signatures from your field images to identify crop stress, disease patterns, and growth variations."
        },
        {
          question: "What is the 3D terrain visualization?",
          answer: "This feature creates a three-dimensional model of your fields using elevation data, helping you understand topography and drainage patterns."
        },
        {
          question: "Can I export my analysis results?",
          answer: "Yes! You can export reports in PDF, CSV, and GeoJSON formats for sharing with your team or integration with other tools."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "What browsers are supported?",
          answer: "Field Prime Viz works best on modern browsers including Chrome, Firefox, Safari, and Edge. Please ensure you're using the latest version."
        },
        {
          question: "Is my data secure?",
          answer: "Absolutely! We use industry-standard encryption and security practices. Your data is stored securely and never shared with third parties."
        },
        {
          question: "What should I do if the site is loading slowly?",
          answer: "Try clearing your browser cache and cookies. If the issue persists, check your internet connection or try a different browser."
        }
      ]
    },
    {
      category: "Account & Billing",
      questions: [
        {
          question: "How do I upgrade my subscription?",
          answer: "Go to Settings > Billing and select your desired plan. Changes take effect immediately."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. You'll retain access until the end of your billing period."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise accounts."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/help")}
            className="mb-4 hover:bg-accent/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help Center
          </Button>
          
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about Field Prime Viz
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 backdrop-blur-sm border-border/40"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {filteredCategories.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No FAQs found matching your search. Try different keywords.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category, categoryIndex) => (
              <Card
                key={categoryIndex}
                className="bg-card/50 backdrop-blur-sm border-border/40"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div
                        key={faqIndex}
                        className="border-b border-border/40 last:border-b-0 pb-4 last:pb-0"
                      >
                        <h3 className="font-medium mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </motion.div>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-medium mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Contact our support team.
              </p>
              <Button onClick={() => navigate("/help")}>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;