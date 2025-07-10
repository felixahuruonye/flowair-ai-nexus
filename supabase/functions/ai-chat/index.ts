import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  prompt: string;
  botType: string;
  userId: string;
}

const getBotSystemPrompt = (botType: string): string => {
  const prompts: Record<string, string> = {
    'Email Generator': 'You are an expert email writer. Generate professional, engaging emails based on the user\'s requirements. Consider tone, purpose, and audience.',
    'Blog & Article Writer': 'You are a professional content writer. Create high-quality, SEO-friendly blog posts and articles that are informative and engaging.',
    'Proposal & Legal Document Creator': 'You are a legal and business writing expert. Create professional proposals and legal documents with proper structure and language.',
    'Live Customer Support Agent': 'You are a helpful customer support agent. Provide friendly, professional, and solution-oriented responses to customer inquiries.',
    'Product & Market Researcher': 'You are a market research expert. Provide comprehensive analysis, insights, and data-driven recommendations about products and markets.',
    'Code Generator': 'You are an expert programmer. Generate clean, efficient, and well-documented code in various programming languages based on user requirements.',
    'Business Operations Manager': 'You are a business operations expert. Help with task management, planning, and business process optimization.',
    'Language Translator Bot': 'You are a professional translator. Provide accurate translations while maintaining context and cultural nuances.',
    'Automation Bot': 'You are a workflow automation expert. Help users design and implement automated processes and workflows.',
    'AI Sales Funnel Builder': 'You are a sales and marketing expert. Create effective sales funnels with compelling copy and strategic flow.',
    'Grant/Proposal Writer': 'You are a grant writing specialist. Create compelling, well-structured grant proposals and funding applications.',
    'AI Tutor Bot': 'You are a patient and knowledgeable tutor. Explain concepts clearly and provide educational support tailored to the user\'s level.',
    'Brand Builder Bot': 'You are a brand strategist. Help develop compelling brand identities, messaging, and positioning strategies.',
    'Dropshipping Assistant': 'You are an e-commerce expert specializing in dropshipping. Provide practical advice for product selection, suppliers, and operations.',
    'Resume + Cover Letter': 'You are a career counselor and resume expert. Create professional, ATS-friendly resumes and compelling cover letters.',
    'Comment Responder': 'You are a social media expert. Generate engaging, appropriate responses to comments and social media interactions.',
    'E-commerce Product Writer': 'You are an e-commerce copywriter. Create compelling product descriptions that drive sales and conversions.',
    'Instagram Caption Generator': 'You are a social media content creator. Generate engaging, hashtag-optimized Instagram captions.',
    'Ad Copy Generator': 'You are an advertising copywriter. Create compelling, conversion-focused ad copy for various platforms.',
    'Script Generator': 'You are a scriptwriter. Create engaging scripts for videos, presentations, and other media content.',
    'Tags/SEO Generator': 'You are an SEO expert. Generate relevant tags, keywords, and SEO-optimized content.',
    'Chat Bot Code Generator': 'You are a chatbot development expert. Generate chatbot logic, flows, and implementation code.',
  };

  return prompts[botType] || 'You are a helpful AI assistant. Provide accurate and helpful responses to user queries.';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, botType, userId }: ChatRequest = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check user's usage limit
    const { data: usageData, error: usageError } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    if (usageError) {
      throw new Error('Failed to check usage limit');
    }

    // Get user's subscription plan
    const { data: profileData } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('user_id', userId)
      .single();

    const isFreeTier = !profileData || profileData.subscription_tier === 'free';
    const usageCount = usageData?.length || 0;

    // Check if user has exceeded free tier limit
    if (isFreeTier && usageCount >= 5) {
      return new Response(
        JSON.stringify({ 
          error: 'Usage limit exceeded. Please upgrade to continue using AI bots.',
          limitExceeded: true 
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Call OpenAI API
    const systemPrompt = getBotSystemPrompt(botType);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    // Log usage to database
    const { error: logError } = await supabase
      .from('user_usage')
      .insert({
        user_id: userId,
        bot_type: botType,
        prompt_text: prompt,
        response_text: generatedText,
        tokens_used: tokensUsed,
      });

    if (logError) {
      console.error('Failed to log usage:', logError);
    }

    return new Response(
      JSON.stringify({ 
        generatedText,
        tokensUsed,
        usageCount: usageCount + 1,
        isFreeTier
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});