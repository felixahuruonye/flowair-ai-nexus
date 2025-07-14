import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bell, Settings, User, CreditCard, LogOut, VolumeX, Volume2
} from 'lucide-react';

interface DashboardHeaderProps {
  creditsRemaining: number;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  currentView: string;
}

const DashboardHeader = ({
  creditsRemaining,
  isSpeaking,
  onStopSpeaking,
  currentView
}: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'history':
        return 'Chat History';
      case 'archived':
        return 'Archived Chats';
      case 'settings':
        return 'Account Settings';
      case 'subscription':
        return 'Subscription Plans';
      case 'chat':
        return 'AI Chat';
      default:
        return 'FlowAIr Dashboard';
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-gradient">{getViewTitle()}</h1>
          <p className="text-sm text-muted-foreground">
            Manage your AI workflows and productivity
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Credits Badge */}
        <Badge 
          variant={creditsRemaining <= 2 ? "destructive" : creditsRemaining <= 5 ? "default" : "secondary"}
          className="px-3 py-1"
        >
          {creditsRemaining} Credits
        </Badge>

        {/* Speaking Control */}
        {isSpeaking && (
          <Button variant="outline" size="sm" onClick={onStopSpeaking}>
            <VolumeX className="h-4 w-4 mr-1" />
            Stop Speaking
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  Free Plan • {creditsRemaining} credits left
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Billing & Plans
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;