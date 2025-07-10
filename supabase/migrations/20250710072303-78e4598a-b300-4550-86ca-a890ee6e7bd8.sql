-- Create usage tracking table
CREATE TABLE public.user_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_type TEXT NOT NULL,
  prompt_text TEXT,
  response_text TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own usage" 
ON public.user_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.user_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create bot types table for managing available bots
CREATE TABLE public.bot_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for bot_types (public read access)
ALTER TABLE public.bot_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bot types are viewable by everyone" 
ON public.bot_types 
FOR SELECT 
USING (is_active = true);

-- Insert the AI bots data
INSERT INTO public.bot_types (name, description, icon, category) VALUES
('Email Generator', 'Generate personal, marketing, and follow-up emails', 'Mail', 'Communication'),
('Blog & Article Writer', 'Create engaging blog posts and articles', 'FileText', 'Content'),
('Proposal & Legal Document Creator', 'Generate proposals and legal documents', 'FileCheck', 'Business'),
('Live Customer Support Agent', 'Auto chat customer support responses', 'MessageCircle', 'Communication'),
('Product & Market Researcher', 'Research products and markets like Google Search AI', 'Search', 'Research'),
('Code Generator', 'Generate code in various programming languages', 'Code', 'Development'),
('Business Operations Manager', 'Manage task lists, calendar, and CRM', 'Briefcase', 'Business'),
('Language Translator Bot', 'Translate text between multiple languages', 'Languages', 'Communication'),
('Automation Bot', 'Connect workflows like Zapier', 'Zap', 'Automation'),
('AI Sales Funnel Builder', 'Build effective sales funnels', 'TrendingUp', 'Marketing'),
('Grant/Proposal Writer', 'Write professional grants and proposals', 'Award', 'Business'),
('AI Tutor Bot', 'Personalized tutoring and education', 'GraduationCap', 'Education'),
('Brand Builder Bot', 'Build and develop your brand identity', 'Sparkles', 'Marketing'),
('Dropshipping Assistant', 'Manage dropshipping business operations', 'Package', 'E-commerce'),
('Resume + Cover Letter', 'Create professional resumes and cover letters', 'User', 'Career'),
('Realistic AI Photo Generator', 'Generate realistic AI photos', 'Camera', 'Creative'),
('AI Video Generator', 'Create AI-generated videos', 'Video', 'Creative'),
('Logo Generator', 'Design professional logos', 'Hexagon', 'Creative'),
('Music & Lyrics Generator', 'Create music and write lyrics', 'Music', 'Creative'),
('Flyer Generator', 'Design marketing flyers', 'Image', 'Creative'),
('PDF Summarizer', 'Summarize PDF documents', 'FileText', 'Productivity'),
('Voice Over Generator', 'Convert text to voice (Podcast Bot)', 'Mic', 'Creative'),
('Comment Responder', 'Generate responses to comments', 'MessageSquare', 'Communication'),
('E-commerce Product Writer', 'Write product descriptions for e-commerce', 'ShoppingCart', 'E-commerce'),
('Instagram Caption Generator', 'Create engaging Instagram captions', 'Instagram', 'Social Media'),
('Ad Copy Generator', 'Generate compelling ad copy', 'Target', 'Marketing'),
('Script Generator', 'Write scripts for videos and presentations', 'Film', 'Creative'),
('Tags/SEO Generator', 'Generate SEO tags and keywords', 'Hash', 'Marketing'),
('Thumbnail Generator', 'Create eye-catching thumbnails', 'Image', 'Creative'),
('Chat Bot Code Generator', 'Generate chatbot code and logic', 'Bot', 'Development');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_user_usage_updated_at
BEFORE UPDATE ON public.user_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_cycle TEXT NOT NULL, -- 'monthly' or 'yearly'
  features TEXT[] NOT NULL,
  usage_limit INTEGER, -- NULL for unlimited
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for subscription plans (public read access)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscription plans are viewable by everyone" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- Insert subscription plans
INSERT INTO public.subscription_plans (name, price, billing_cycle, features, usage_limit) VALUES
('Free', 0.00, 'monthly', ARRAY['5 AI tasks per month', 'Basic bots access', 'Email support'], 5),
('Pro Monthly', 19.99, 'monthly', ARRAY['Unlimited AI tasks', 'All bots access', 'Priority support', 'Advanced features'], NULL),
('Pro Yearly', 199.99, 'yearly', ARRAY['Unlimited AI tasks', 'All bots access', 'Priority support', 'Advanced features', '2 months free'], NULL);