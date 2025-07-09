
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  FileText,
  MessageSquare,
  Search,
  Code,
  Calendar,
  Languages,
  Zap,
  TrendingUp,
  BookOpen,
  Building,
  Briefcase,
  User,
  Image,
  Video,
  Palette,
  Music,
  FileImage,
  FileCheck,
  Mic,
  MessageCircle,
  ShoppingCart,
  Instagram,
  PenTool,
  Hash,
  Bot
} from 'lucide-react';

const aiJobBots = [
  { icon: Mail, name: "Email Generator", description: "Personal, marketing, follow-up emails", category: "Communication", color: "bg-blue-500" },
  { icon: FileText, name: "Blog & Article Writer", description: "SEO-optimized content creation", category: "Content", color: "bg-green-500" },
  { icon: FileCheck, name: "Proposal & Legal Creator", description: "Professional documents & contracts", category: "Business", color: "bg-purple-500" },
  { icon: MessageSquare, name: "Live Customer Support", description: "Auto chat support agent", category: "Support", color: "bg-orange-500" },
  { icon: Search, name: "Product & Market Research", description: "Google Search AI powered", category: "Research", color: "bg-indigo-500" },
  { icon: Code, name: "Code Generator", description: "Like Lovable.dev for development", category: "Development", color: "bg-gray-800" },
  { icon: Calendar, name: "Business Operations", description: "Task lists, Calendar, CRM Lite", category: "Productivity", color: "bg-red-500" },
  { icon: Languages, name: "Language Translator", description: "Multi-language translation", category: "Communication", color: "bg-teal-500" },
  { icon: Zap, name: "Automation Bot", description: "Zapier-like workflow connections", category: "Automation", color: "bg-yellow-500" },
  { icon: TrendingUp, name: "Sales Funnel Builder", description: "Complete funnel creation", category: "Marketing", color: "bg-pink-500" },
  { icon: BookOpen, name: "Grant/Proposal Writer", description: "Professional grant applications", category: "Business", color: "bg-cyan-500" },
  { icon: User, name: "AI Tutor Bot", description: "Personalized learning assistant", category: "Education", color: "bg-lime-500" },
  { icon: Building, name: "Brand Builder Bot", description: "Complete brand identity creation", category: "Branding", color: "bg-violet-500" },
  { icon: ShoppingCart, name: "Dropshipping Assistant", description: "E-commerce automation", category: "E-commerce", color: "bg-emerald-500" },
  { icon: Briefcase, name: "Resume & Cover Letter", description: "Professional job applications", category: "Career", color: "bg-slate-500" },
  { icon: Image, name: "Realistic AI Photo Generator", description: "High-quality image creation", category: "Media", color: "bg-rose-500" },
  { icon: Video, name: "AI Video Generator", description: "Professional video content", category: "Media", color: "bg-blue-600" },
  { icon: Palette, name: "Logo Generator", description: "Professional brand logos", category: "Design", color: "bg-orange-600" },
  { icon: Music, name: "Music & Lyrics Generator", description: "Original music composition", category: "Creative", color: "bg-purple-600" },
  { icon: FileImage, name: "Flyer Generator", description: "Marketing materials design", category: "Design", color: "bg-green-600" },
  { icon: FileCheck, name: "PDF Summarizer", description: "Document analysis & summary", category: "Productivity", color: "bg-indigo-600" },
  { icon: Mic, name: "Voice Over Generator", description: "Text to speech for podcasts", category: "Audio", color: "bg-red-600" },
  { icon: MessageCircle, name: "Comment Responder", description: "Social media engagement", category: "Social", color: "bg-teal-600" },
  { icon: ShoppingCart, name: "E-commerce Product Writer", description: "Product descriptions & SEO", category: "E-commerce", color: "bg-yellow-600" },
  { icon: Instagram, name: "Instagram Caption Generator", description: "Engaging social media content", category: "Social", color: "bg-pink-600" },
  { icon: PenTool, name: "Ad Copy Generator", description: "High-converting advertisements", category: "Marketing", color: "bg-cyan-600" },
  { icon: FileText, name: "Script Generator", description: "Video & presentation scripts", category: "Content", color: "bg-lime-600" },
  { icon: Hash, name: "Tags/SEO Generator", description: "Optimization keywords & tags", category: "SEO", color: "bg-violet-600" },
  { icon: Image, name: "Thumbnail Generator", description: "Eye-catching video thumbnails", category: "Design", color: "bg-emerald-600" },
  { icon: Bot, name: "Chat Bot Code Generator", description: "Custom chatbot development", category: "Development", color: "bg-slate-600" }
];

const categories = ["All", "Communication", "Content", "Business", "Development", "Marketing", "Design", "Media"];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Bot className="w-4 h-4 mr-2" />
            30+ AI Job Bots
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Your Complete AI
            <span className="text-gradient"> Workforce</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From content creation to business automation, our specialized AI bots handle every aspect 
            of your workflow. Each bot is designed for specific tasks and delivers professional results instantly.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant={category === "All" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* AI Bots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {aiJobBots.map((bot, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${bot.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <bot.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {bot.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {bot.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {bot.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Instant Results</span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    AI Powered
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Workflow?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who are already using FlowAIr to automate their daily tasks 
              and scale their productivity with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="gradient-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Start Free Trial
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                View All Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
