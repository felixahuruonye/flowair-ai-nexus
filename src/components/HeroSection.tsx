
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Bot, 
  Globe, 
  Zap, 
  ArrowRight,
  Play,
  Users,
  Star
} from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      
      <div className="container mx-auto text-center">
        {/* Announcement Badge */}
        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
          <Sparkles className="w-4 h-4 mr-2" />
          24 AI Job Bots Available Now
        </Badge>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
          Your Global AI
          <br />
          <span className="text-gradient">Virtual Workspace</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
          Access 24 specialized AI job bots from one powerful dashboard. 
          Automate emails, generate content, build code, manage business operations, 
          and scale your productivity globally.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>10,000+ Users Worldwide</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <span>24 AI Job Bots</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Available in 10+ Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.9/5 Rating</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="gradient-primary text-white hover:opacity-90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-4 text-lg font-semibold border-2 hover:bg-muted"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="gradient-primary p-3 rounded-full w-fit mx-auto mb-4">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">24 AI Job Bots</h3>
            <p className="text-sm text-muted-foreground">From email generation to code creation, all in one dashboard</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="gradient-secondary p-3 rounded-full w-fit mx-auto mb-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Global & Multilingual</h3>
            <p className="text-sm text-muted-foreground">Available worldwide with support for 10+ languages</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="gradient-primary p-3 rounded-full w-fit mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Instant Results</h3>
            <p className="text-sm text-muted-foreground">Get professional results in seconds, not hours</p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-6">Trusted by entrepreneurs, agencies, and businesses worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for company logos */}
            <div className="h-8 w-20 bg-muted rounded"></div>
            <div className="h-8 w-20 bg-muted rounded"></div>
            <div className="h-8 w-20 bg-muted rounded"></div>
            <div className="h-8 w-20 bg-muted rounded"></div>
            <div className="h-8 w-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
