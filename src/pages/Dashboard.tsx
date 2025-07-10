import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { 
  Send, Bot, User, Sparkles, Search, Mail, FileText, FileCheck, MessageCircle,
  Code, Briefcase, Languages, Zap, TrendingUp, Award, GraduationCap, Package,
  Camera, Video, Hexagon, Music, Image, Mic, MessageSquare, ShoppingCart,
  Target, Film, Hash, Instagram, Copy, Download, RefreshCw, Volume2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BotType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const iconMap: Record<string, any> = {
  Mail, FileText, FileCheck, MessageCircle, Search, Code, Briefcase, Languages, Zap,
  TrendingUp, Award, GraduationCap, Sparkles, Package, User, Camera, Video, Hexagon,
  Music, Image, Mic, MessageSquare, ShoppingCart, Instagram, Target, Film, Hash, Bot
};

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bots, setBots] = useState<BotType[]>([]);
  const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(5);

  useEffect(() => {
    fetchBots();
    fetchUsageCount();
  }, []);

  const fetchBots = async () => {
    const { data, error } = await supabase
      .from('bot_types')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load bots",
        variant: "destructive",
      });
    } else {
      setBots(data || []);
    }
  };

  const fetchUsageCount = async () => {
    if (!user) return;
    
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', currentMonth.toISOString());
    
    if (!error && data) {
      setUsageCount(data.length);
    }
  };

  const filteredBots = bots.filter(bot => 
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectBot = (bot: BotType) => {
    setSelectedBot(bot);
    setMessages([{
      id: '1',
      content: `Hi! I'm your ${bot.name}. ${bot.description}. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedBot || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('ai-chat', {
        body: {
          prompt: inputMessage,
          botType: selectedBot.name,
          userId: user.id
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data.limitExceeded) {
        toast({
          title: "Usage Limit Reached",
          description: "You've reached your free tier limit. Upgrade to continue using AI bots.",
          variant: "destructive",
        });
        return;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.generatedText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setUsageCount(response.data.usageCount);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const regenerateResponse = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.sender === 'user') {
        setInputMessage(lastUserMessage.content);
        sendMessage();
      }
    }
  };

  if (!selectedBot) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="gradient-primary p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient">FlowAIr Dashboard</span>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">{usageCount}/{usageLimit} Free Tasks</Badge>
                <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI bots..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Popular Bots Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">🔥 Popular AI Bots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBots.slice(0, 6).map((bot) => {
                const IconComponent = iconMap[bot.icon] || Bot;
                return (
                  <Card key={bot.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => selectBot(bot)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="gradient-primary p-2 rounded-lg">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{bot.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">{bot.category}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{bot.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* All Bots Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4">🧠 All AI Job Bots ({filteredBots.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBots.map((bot) => {
                const IconComponent = iconMap[bot.icon] || Bot;
                return (
                  <Card key={bot.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => selectBot(bot)}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <div className="gradient-primary p-1.5 rounded">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-sm">{bot.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-2">{bot.description}</p>
                      <Badge variant="outline" className="text-xs">{bot.category}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedBot(null)}>
                ← Back to Bots
              </Button>
              <div className="gradient-primary p-2 rounded-lg">
                {(() => {
                  const IconComponent = iconMap[selectedBot.icon] || Bot;
                  return <IconComponent className="h-6 w-6 text-white" />;
                })()}
              </div>
              <span className="text-2xl font-bold text-gradient">{selectedBot.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{usageCount}/{usageLimit} Free Tasks</Badge>
              <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Bot Info</CardTitle>
                <CardDescription>{selectedBot.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="secondary">{selectedBot.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Usage</span>
                  <span className="text-sm font-medium">{usageCount}/{usageLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="text-sm font-medium">Free</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[70vh] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const IconComponent = iconMap[selectedBot.icon] || Bot;
                      return <IconComponent className="h-5 w-5" />;
                    })()}
                    <span>{selectedBot.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(messages[messages.length - 1]?.content || '')}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={regenerateResponse}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {selectedBot.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col space-y-4">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender === 'bot' && (
                          <div className="gradient-primary p-2 rounded-full">
                            {(() => {
                              const IconComponent = iconMap[selectedBot.icon] || Bot;
                              return <IconComponent className="h-4 w-4 text-white" />;
                            })()}
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                            {message.sender === 'bot' && (
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(message.content)}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Volume2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {message.sender === 'user' && (
                          <div className="bg-primary p-2 rounded-full">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex items-start space-x-3">
                        <div className="gradient-primary p-2 rounded-full">
                          {(() => {
                            const IconComponent = iconMap[selectedBot.icon] || Bot;
                            return <IconComponent className="h-4 w-4 text-white" />;
                          })()}
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask ${selectedBot.name} anything...`}
                    disabled={isLoading}
                    className="flex-1 min-h-[60px] resize-none"
                    rows={2}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim() || (usageCount >= usageLimit)}
                    size="icon"
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {usageCount >= usageLimit && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-destructive">
                      You've reached your free tier limit. Upgrade to continue using AI bots.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;