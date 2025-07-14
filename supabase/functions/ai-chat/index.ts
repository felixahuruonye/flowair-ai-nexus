import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

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

const getBotConfig = (botType: string) => {
  const configs: Record<string, { prompt: string; apiEndpoint: string; apiKey: string; model?: string }> = {
    'Technical Writer': {
      prompt: 'You are an expert technical writer specializing in creating clear, comprehensive documentation, user guides, API documentation, and technical specifications. You excel at breaking down complex technical concepts into understandable content.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Business Consultant': {
      prompt: 'You are a seasoned business consultant with expertise in strategy, operations, market analysis, and business development. You provide actionable insights and strategic recommendations.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Creative Writer': {
      prompt: 'You are a creative writer specializing in storytelling, creative content, fiction, poetry, and imaginative writing. You craft engaging narratives and creative pieces.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Data Analyst': {
      prompt: 'You are a data analyst expert in data interpretation, statistical analysis, reporting, and data visualization. You help analyze trends and provide data-driven insights.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Marketing Specialist': {
      prompt: 'You are a marketing specialist with expertise in digital marketing, campaign strategy, brand management, and market research. You create effective marketing strategies and content.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Legal Assistant': {
      prompt: 'You are a legal assistant with knowledge of legal procedures, document preparation, and legal research. You help with legal documentation and provide general legal information.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Academic Researcher': {
      prompt: 'You are an academic researcher with expertise in research methodology, literature review, academic writing, and scholarly analysis. You help with research projects and academic content.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Software Developer': {
      prompt: 'You are a software developer with expertise in multiple programming languages, software architecture, debugging, and best practices. You help with coding problems and software development.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Financial Advisor': {
      prompt: 'You are a financial advisor with expertise in personal finance, investment strategies, budgeting, and financial planning. You provide financial guidance and advice.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Healthcare Assistant': {
      prompt: 'You are a healthcare assistant with knowledge of medical terminology, health information, and wellness guidance. You provide general health information and support.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    }
  };

  return configs[botType] || {
    prompt: 'You are a helpful AI assistant. Provide accurate and helpful responses to user queries.',
    apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: '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',
    model: 'mistralai/mixtral-8x7b-instruct'
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, botType, userId }: ChatRequest = await req.json();

    console.log('Received request:', { prompt, botType, userId });

    if (!prompt || !botType) {
      throw new Error('Prompt and botType are required');
    }

    // Get bot configuration
    const botConfig = getBotConfig(botType);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check user's usage limit
    const { data: usageData, error: usageError } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    if (usageError) {
      console.error('Usage check error:', usageError);
      throw new Error('Failed to check usage limit');
    }

    // Get user's subscription plan and credits
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, credits_remaining')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userCredits = profileData?.credits_remaining || 0;
    
    // Check if user has exceeded their credit limit
    if (userCredits <= 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No credits remaining. Please upgrade to continue using AI bots.',
          limitExceeded: true 
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let generatedText = '';
    let tokensUsed = 0;

    // All bots now use OpenRouter for text generation
    console.log(`Making OpenRouter API call for bot: ${botType}`);
    const response = await fetch(botConfig.apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${botConfig.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovableproject.com',
        'X-Title': 'FlowAIr Bot'
      },
      body: JSON.stringify({
        model: botConfig.model,
        messages: [
          { role: 'system', content: botConfig.prompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    generatedText = data.choices?.[0]?.message?.content || 'No response generated';
    tokensUsed = data.usage?.total_tokens || 0;

    // Deduct credits and log usage to database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits_remaining: userCredits - 1 })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating credits:', updateError);
    }

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
      console.error('Error logging usage:', logError);
    }

    console.log('Generated response successfully');

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        remainingCredits: userCredits - 1
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});