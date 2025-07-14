import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot, User, Copy, RefreshCw, Volume2, Download, Send,
  FileText, Code, Briefcase, BarChart3, Megaphone, Scale,
  GraduationCap, DollarSign, HeartPulse
} from 'lucide-react';

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

interface ChatInterfaceProps {
  selectedBot: BotType;
  messages: Message[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onCopyToClipboard: (text: string) => void;
  onRegenerateResponse: () => void;
  onSpeakText: (text: string) => void;
  onDownloadAudio: (base64Audio: string, fileName: string) => void;
  isSpeaking: boolean;
  creditsRemaining: number;
}

const iconMap: Record<string, any> = {
  'file-text': FileText,
  'briefcase': Briefcase,
  'pen-tool': Code,
  'bar-chart': BarChart3,
  'megaphone': Megaphone,
  'scale': Scale,
  'graduation-cap': GraduationCap,
  'code': Code,
  'dollar-sign': DollarSign,
  'heart-pulse': HeartPulse,
};

const ChatInterface = ({
  selectedBot,
  messages,
  inputMessage,
  setInputMessage,
  isLoading,
  onSendMessage,
  onKeyPress,
  onCopyToClipboard,
  onRegenerateResponse,
  onSpeakText,
  onDownloadAudio,
  isSpeaking,
  creditsRemaining
}: ChatInterfaceProps) => {
  const IconComponent = iconMap[selectedBot.icon] || Bot;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bot Info Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="gradient-primary p-2 rounded-lg">
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedBot.name}</CardTitle>
                  <Badge variant="secondary">{selectedBot.category}</Badge>
                </div>
              </div>
              <CardDescription>{selectedBot.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Credits Left</span>
                <Badge variant={creditsRemaining <= 2 ? "destructive" : "secondary"}>
                  {creditsRemaining}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-sm font-medium">Free Trial</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Messages</span>
                <span className="text-sm font-medium">{messages.length}</span>
              </div>
              
              {/* Quick Prompts */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Quick Prompts</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-left justify-start text-xs h-auto p-2"
                    onClick={() => setInputMessage("Help me get started")}
                  >
                    Help me get started
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-left justify-start text-xs h-auto p-2"
                    onClick={() => setInputMessage("What can you do?")}
                  >
                    What can you do?
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-left justify-start text-xs h-auto p-2"
                    onClick={() => setInputMessage("Show me an example")}
                  >
                    Show me an example
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[75vh] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5" />
                  <span>{selectedBot.name}</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onCopyToClipboard(messages[messages.length - 1]?.content || '')}
                    disabled={messages.length === 0}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Last
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onRegenerateResponse}
                    disabled={messages.length < 2}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Chat with your AI assistant. {creditsRemaining} credits remaining.
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
                        <div className="gradient-primary p-2 rounded-full flex-shrink-0">
                          <IconComponent className="h-4 w-4 text-white" />
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
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => onCopyToClipboard(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              {message.audioData ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onDownloadAudio(message.audioData!, `voiceover-${message.id}.mp3`)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onSpeakText(message.content)}
                                  disabled={isSpeaking}
                                >
                                  <Volume2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="bg-primary p-2 rounded-full flex-shrink-0">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex space-x-2 pt-4 border-t">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask ${selectedBot.name} anything...`}
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                  onKeyPress={onKeyPress}
                  disabled={creditsRemaining <= 0}
                />
                <Button 
                  onClick={onSendMessage} 
                  disabled={!inputMessage.trim() || isLoading || creditsRemaining <= 0}
                  className="gradient-primary text-white border-0 px-6"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {creditsRemaining <= 0 && (
                <div className="text-center p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">
                    You've run out of credits. Upgrade your plan to continue chatting!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;