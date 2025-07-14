import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardMain from '@/components/DashboardMain';
import ChatInterface from '@/components/ChatInterface';
import { supabase } from '@/integrations/supabase/client';
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
  audioData?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bots, setBots] = useState<BotType[]>([]);
  const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    fetchBots();
    if (user) {
      fetchCreditsData();
    }
  }, [user]);

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

  const fetchCreditsData = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits_remaining')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        setCreditsRemaining(0);
        return;
      }
      
      setCreditsRemaining(data?.credits_remaining || 0);
    } catch (error) {
      console.error('Error fetching credits data:', error);
      setCreditsRemaining(0);
    }
  };

  const speakText = (text: string) => {
    if (text.includes('🎵 Audio generated')) return; // Don't read audio messages
    
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const downloadAudio = (base64Audio: string, fileName: string) => {
    try {
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'voiceover.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Audio file downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download audio file",
        variant: "destructive",
      });
    }
  };

  const selectBot = (bot: BotType | null) => {
    setSelectedBot(bot);
    if (bot) {
      setCurrentView('chat');
      const welcomeMessage = `Hi! I'm your ${bot.name}. ${bot.description}. How can I help you today?`;
      setMessages([{
        id: '1',
        content: welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
      
      // Read welcome message
      speakText(welcomeMessage);
    } else {
      setCurrentView('dashboard');
      setMessages([]);
    }
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
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('ai-chat', {
        body: {
          prompt: currentInput,
          botType: selectedBot.name,
          userId: user.id
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data.limitExceeded) {
        toast({
          title: "Credit Limit Reached",
          description: "You've run out of credits. Please upgrade to continue using AI bots.",
          variant: "destructive",
        });
        return;
      }

      const { response: generatedText, remainingCredits: newCredits } = response.data;
      
      setCreditsRemaining(newCredits);
      
      let content = generatedText;
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Read out the bot response
      speakText(content);
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar
          bots={bots}
          selectedBot={selectedBot}
          onSelectBot={selectBot}
          creditsRemaining={creditsRemaining}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            creditsRemaining={creditsRemaining}
            isSpeaking={isSpeaking}
            onStopSpeaking={stopSpeaking}
            currentView={currentView}
          />
          
          <main className="flex-1">
            {selectedBot ? (
              <ChatInterface
                selectedBot={selectedBot}
                messages={messages}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                isLoading={isLoading}
                onSendMessage={sendMessage}
                onKeyPress={handleKeyPress}
                onCopyToClipboard={copyToClipboard}
                onRegenerateResponse={regenerateResponse}
                onSpeakText={speakText}
                onDownloadAudio={downloadAudio}
                isSpeaking={isSpeaking}
                creditsRemaining={creditsRemaining}
              />
            ) : (
              <DashboardMain
                bots={bots}
                creditsRemaining={creditsRemaining}
                onSelectBot={selectBot}
                currentView={currentView}
              />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;