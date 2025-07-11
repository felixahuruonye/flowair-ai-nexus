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
    'Email Generator': {
      prompt: 'You are an AI that writes personal, marketing, and follow-up emails.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Blog & Article Writer': {
      prompt: 'You are an AI that creates seo-optimized blogs and articles.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Proposal & Legal Document Creator': {
      prompt: 'You are an AI that drafts legal and business proposals.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Live Customer Support Agent': {
      prompt: 'You are an AI that acts as an automated live chat agent.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Product & Market Researcher': {
      prompt: 'You are an AI that provides ai-powered market insights.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Code Generator': {
      prompt: 'You are an AI that generates code snippets or scripts from instructions.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Business Operations Manager': {
      prompt: 'You are an AI that manages basic crm, tasks, and calendars.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Language Translator Bot': {
      prompt: 'You are an AI that translates text between multiple languages.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'AI Sales Funnel Builder': {
      prompt: 'You are an AI that builds sales funnels from product ideas.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Grant/Proposal Writer': {
      prompt: 'You are an AI that writes grant or funding proposals.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'AI Tutor Bot': {
      prompt: 'You are an AI that explains academic concepts like a teacher.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Brand Builder Bot': {
      prompt: 'You are an AI that helps brainstorm brand name and identity.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Dropshipping Assistant': {
      prompt: 'You are an AI that assists with product research for dropshipping.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Resume + Cover Letter': {
      prompt: 'You are an AI that creates tailored resumes and cover letters.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Realistic AI Photo Generator': {
      prompt: 'You are an AI that generates realistic photos.',
      apiEndpoint: 'https://api.replicate.com/v1/predictions',
      apiKey: 'r8_VDq8LS9tYPJV0jjXSYg8lCHqh8MB4ci3PFA6C'
    },
    'AI Video Generator': {
      prompt: 'You are an AI that creates ai-generated videos.',
      apiEndpoint: 'https://api.pexels.com/videos/search',
      apiKey: '11mHiyyWTCXa6x86irYeXtkC2ueaeaUOwdMlMiggHINxpTQ4j5pltLYh'
    },
    'Logo Generator': {
      prompt: 'You are an AI that designs logo ideas based on brand.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Music & Lyrics Generator': {
      prompt: 'You are an AI that generates music lyrics and melody ideas.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Flyer Generator': {
      prompt: 'You are an AI that creates marketing flyers.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'PDF Summarizer Bot': {
      prompt: 'You are an AI that summarizes long pdf content.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Voice Over from Text (Procast Bot)': {
      prompt: 'You are an AI that generates voiceover from text.',
      apiEndpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
      apiKey: 'sk_6c7fe06d5fe13818315e8d032be33050922b59de497a1d53'
    },
    'Comment Responder': {
      prompt: 'You are an AI that replies to social media comments.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'E-commerce Product Writer': {
      prompt: 'You are an AI that writes product descriptions.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Instagram Caption Generator': {
      prompt: 'You are an AI that creates captions for instagram posts.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Ad Copy Generator': {
      prompt: 'You are an AI that writes persuasive ad copy.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Script Generator': {
      prompt: 'You are an AI that generates video or podcast scripts.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Tags/SEO Generator': {
      prompt: 'You are an AI that generates tags and seo keywords.',
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKey: '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',
      model: 'mistralai/mixtral-8x7b-instruct'
    },
    'Thumbnail Generator': {
      prompt: 'You are an AI that creates youtube-style thumbnails.',
      apiEndpoint: 'https://api.replicate.com/v1/predictions',
      apiKey: 'r8_VDq8LS9tYPJV0jjXSYg8lCHqh8MB4ci3PFA6C'
    },
    'Chat Bot Code Generator': {
      prompt: 'You are an AI that generates chatbot logic/code.',
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

    const isFreeTier = !profileData || profileData.subscription_tier === 'free';
    const usageCount = usageData?.length || 0;

    // Get user's current credits
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

    // Handle different API providers
    if (botConfig.apiEndpoint.includes('openrouter.ai')) {
      // OpenRouter API call
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

    } else if (botConfig.apiEndpoint.includes('replicate.com')) {
      // Replicate API for image generation
      console.log(`Making Replicate API call for bot: ${botType}`);
      const response = await fetch(botConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${botConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
          input: {
            prompt: prompt,
            negative_prompt: 'blurry, bad quality',
            width: 1024,
            height: 1024,
            num_inference_steps: 25
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Replicate API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Replicate API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      generatedText = `Image generation started. Prediction ID: ${data.id}. This will generate an image based on your prompt: "${prompt}". Please check back in a few moments for the result.`;
      tokensUsed = 50; // Estimate for image generation

    } else if (botConfig.apiEndpoint.includes('pexels.com')) {
      // Pexels API for video search
      console.log(`Making Pexels API call for bot: ${botType}`);
      const response = await fetch(`${botConfig.apiEndpoint}?query=${encodeURIComponent(prompt)}&per_page=5`, {
        headers: {
          'Authorization': botConfig.apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Pexels API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const videos = data.videos || [];
      if (videos.length > 0) {
        const videoList = videos.map((video: any, index: number) => 
          `${index + 1}. ${video.url} (Duration: ${video.duration}s)`
        ).join('\n');
        generatedText = `Found ${videos.length} videos related to "${prompt}":\n\n${videoList}`;
      } else {
        generatedText = `No videos found for "${prompt}". Try a different search term.`;
      }
      tokensUsed = 25;

    } else if (botConfig.apiEndpoint.includes('elevenlabs.io')) {
      // ElevenLabs API for text-to-speech
      console.log(`Making ElevenLabs API call for bot: ${botType}`);
      const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': botConfig.apiKey,
        },
        body: JSON.stringify({
          text: prompt,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ElevenLabs API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      } else {
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
        generatedText = `AUDIO_RESPONSE:${base64Audio}`;
      }
      tokensUsed = 1;

    } else {
      // Fallback to default text response
      console.log(`Using fallback response for bot: ${botType}`);
      generatedText = `${botConfig.prompt}\n\nBased on your request: "${prompt}"\n\nI'm processing your request using specialized AI capabilities. Here's a response tailored to the ${botType} function.`;
      tokensUsed = 50;
    }

    // Deduct credits and log usage to database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits_remaining: userCredits - 1 })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Failed to update credits:', updateError);
    }

    const { error: logError } = await supabase
      .from('user_usage')
      .insert({
        user_id: userId,
        bot_type: botType,
        prompt_text: prompt,
        response_text: generatedText.includes('AUDIO_RESPONSE:') ? 'Audio generated' : generatedText,
        tokens_used: tokensUsed,
      });

    if (logError) {
      console.error('Failed to log usage:', logError);
    }

    return new Response(
      JSON.stringify({ 
        generatedText,
        tokensUsed,
        creditsRemaining: userCredits - 1,
        isAudio: generatedText.includes('AUDIO_RESPONSE:')
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