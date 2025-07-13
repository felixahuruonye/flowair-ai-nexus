
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Code,
  Zap,
  TrendingUp,
  Briefcase,
  User,
  PenTool,
  FileCheck,
  Target,
  GraduationCap,
  Award,
  Bot
} from 'lucide-react';

const aiJobBots = [
  { icon: FileText, name: "Technical Writer", description: "Expert technical documentation and writing", category: "Content", color: "bg-blue-500" },
  { icon: Briefcase, name: "Business Consultant", description: "Strategic business advice and planning", category: "Business", color: "bg-green-500" },
  { icon: PenTool, name: "Creative Writer", description: "Engaging creative content and storytelling", category: "Content", color: "bg-purple-500" },
  { icon: TrendingUp, name: "Data Analyst", description: "Data analysis and insights generation", category: "Analytics", color: "bg-orange-500" },
  { icon: Target, name: "Marketing Specialist", description: "Strategic marketing and campaign planning", category: "Marketing", color: "bg-indigo-500" },
  { icon: FileCheck, name: "Legal Assistant", description: "Legal document review and guidance", category: "Legal", color: "bg-gray-800" },
  { icon: GraduationCap, name: "Academic Researcher", description: "Research assistance and academic writing", category: "Research", color: "bg-red-500" },
  { icon: Code, name: "Software Developer", description: "Code generation and development assistance", category: "Development", color: "bg-teal-500" },
  { icon: Award, name: "Financial Advisor", description: "Financial planning and investment guidance", category: "Finance", color: "bg-yellow-500" },
  { icon: User, name: "Healthcare Assistant", description: "Medical information and health guidance", category: "Healthcare", color: "bg-pink-500" }
];

const categories = ["All", "Content", "Business", "Analytics", "Marketing", "Legal", "Research", "Development", "Finance", "Healthcare"];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Bot className="w-4 h-4 mr-2" />
            10 Specialized AI Bots
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Your Complete AI
            <span className="text-gradient"> Workforce</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From technical writing to business consulting, our specialized AI bots handle professional tasks 
            with expertise. Each bot is trained for specific domains and delivers high-quality results instantly.
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
