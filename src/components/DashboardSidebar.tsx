import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bot, Search, FileText, Code, Briefcase, TrendingUp, Award,
  GraduationCap, Target, User, BarChart3, Megaphone, Scale,
  HeartPulse, DollarSign, History, Settings, CreditCard,
  Archive, Download, Trash2, Mail, LogOut, Home
} from 'lucide-react';
import { Sparkles } from 'lucide-react';

interface BotType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface DashboardSidebarProps {
  bots: BotType[];
  selectedBot: BotType | null;
  onSelectBot: (bot: BotType | null) => void;
  creditsRemaining: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
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

const DashboardSidebar = ({
  bots,
  selectedBot,
  onSelectBot,
  creditsRemaining,
  searchQuery,
  onSearchChange
}: DashboardSidebarProps) => {
  const { user, signOut } = useAuth();
  const sidebar = useSidebar();
  const collapsed = sidebar.open === false;
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'history', label: 'Chat History', icon: History },
    { id: 'archived', label: 'Archived Chats', icon: Archive },
    { id: 'settings', label: 'Account Settings', icon: Settings },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  const utilityItems = [
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  const filteredBots = bots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuClick = (itemId: string) => {
    setActiveSection(itemId);
    if (itemId === 'dashboard') {
      onSelectBot(null);
    } else if (itemId === 'logout') {
      handleSignOut();
    }
    // Handle other menu items in parent component
  };

  const handleBotSelect = (bot: BotType) => {
    onSelectBot(bot);
    setActiveSection('chat');
  };

  return (
    <Sidebar className="border-r bg-sidebar-background">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="gradient-primary p-2 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-lg font-bold text-gradient">FlowAIr</span>
              <p className="text-xs text-muted-foreground">AI Dashboard</p>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Credits</span>
              <Badge variant={creditsRemaining <= 2 ? "destructive" : "secondary"}>
                {creditsRemaining}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Welcome, {user?.email?.split('@')[0]}
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Search Bar */}
        {!collapsed && (
          <div className="px-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search bots..."
                className="pl-10 h-9"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    className={activeSection === item.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  >
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Bots */}
        <SidebarGroup>
          <SidebarGroupLabel>AI Bots ({filteredBots.length})</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredBots.map((bot) => {
                const IconComponent = iconMap[bot.icon] || Bot;
                return (
                  <SidebarMenuItem key={bot.id}>
                    <SidebarMenuButton
                      asChild
                      className={selectedBot?.id === bot.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                    >
                      <button
                        onClick={() => handleBotSelect(bot)}
                        className="w-full flex items-start gap-2 p-2"
                        title={bot.description}
                      >
                        <div className="gradient-primary p-1 rounded">
                          <IconComponent className="h-3 w-3 text-white" />
                        </div>
                        {!collapsed && (
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-medium truncate">{bot.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {bot.category}
                            </div>
                          </div>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Utilities */}
        <SidebarGroup>
          <SidebarGroupLabel>Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    className={item.id === 'logout' ? "text-destructive hover:text-destructive" : ""}
                  >
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;