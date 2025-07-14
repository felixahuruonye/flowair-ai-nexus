import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Bot, TrendingUp, Clock, Zap, Users, Calendar,
  BarChart3, Target, Award, Sparkles
} from 'lucide-react';

interface BotType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface DashboardMainProps {
  bots: BotType[];
  creditsRemaining: number;
  onSelectBot: (bot: BotType) => void;
  currentView: string;
}

const DashboardMain = ({ bots, creditsRemaining, onSelectBot, currentView }: DashboardMainProps) => {
  const [usageStats, setUsageStats] = useState({
    totalChats: 0,
    todayChats: 0,
    favoriteBot: '',
    activeTime: '0 mins'
  });

  // Mock usage data - replace with real Supabase queries
  useEffect(() => {
    // Simulate fetching usage stats
    setUsageStats({
      totalChats: 24,
      todayChats: 5,
      favoriteBot: 'Technical Writer',
      activeTime: '45 mins'
    });
  }, []);

  const recentBots = bots.slice(0, 4);
  const popularBots = bots.slice(0, 6);
  const creditUsagePercentage = ((10 - creditsRemaining) / 10) * 100;

  if (currentView !== 'dashboard') {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature Coming Soon</CardTitle>
            <CardDescription>
              This section is under development. Please check back later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-muted-foreground mb-4">
              Ready to boost your productivity with AI? You have {creditsRemaining} credits remaining.
            </p>
            <div className="flex gap-2">
              <Button className="gradient-primary text-white border-0">
                <Sparkles className="mr-2 h-4 w-4" />
                Start New Chat
              </Button>
              <Button variant="outline">View History</Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="gradient-primary p-4 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.totalChats}</div>
            <p className="text-xs text-muted-foreground">
              +{usageStats.todayChats} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{10 - creditsRemaining}/10</div>
            <Progress value={creditUsagePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.activeTime}</div>
            <p className="text-xs text-muted-foreground">
              This session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Bot</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{usageStats.favoriteBot}</div>
            <p className="text-xs text-muted-foreground">
              Most used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Bots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Access
            </CardTitle>
            <CardDescription>
              Your most frequently used AI assistants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {recentBots.map((bot) => (
                <Button
                  key={bot.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start gap-2 hover:shadow-md transition-shadow"
                  onClick={() => onSelectBot(bot)}
                >
                  <div className="gradient-primary p-2 rounded">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{bot.name}</div>
                    <div className="text-xs text-muted-foreground">{bot.category}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Bots
            </CardTitle>
            <CardDescription>
              Trending AI assistants this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularBots.map((bot, index) => (
                <div
                  key={bot.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelectBot(bot)}
                >
                  <div className="gradient-primary p-1.5 rounded">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{bot.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{bot.category}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage and Subscription Reminder */}
      {creditsRemaining <= 3 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Running Low on Credits</CardTitle>
            <CardDescription>
              You have {creditsRemaining} credits remaining. Upgrade to continue using AI bots without interruption.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button className="gradient-primary text-white border-0">
                Upgrade Now
              </Button>
              <Button variant="outline">View Plans</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardMain;