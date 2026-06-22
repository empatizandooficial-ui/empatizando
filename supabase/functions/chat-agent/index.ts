import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { agent_id, message, context } = await req.json();

    if (!agent_id || !message) {
      throw new Error("Missing agent_id or message");
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch Agent Configuration
    const { data: agentConfig, error: agentError } = await supabase
      .from('agent_configurations')
      .select('*')
      .eq('id', agent_id)
      .single();

    if (agentError || !agentConfig) {
      throw new Error(`Agent configuration not found for id: ${agent_id}`);
    }

    const { system_prompt, model_provider, model_name, temperature } = agentConfig;

    let reply = "";

    // Build the payload Context (e.g. Anamnese Data)
    const contextString = context ? `\n\n[CONTEXTO DO PACIENTE]:\n${JSON.stringify(context, null, 2)}` : '';
    const fullSystemPrompt = system_prompt + contextString;

    // Call the respective AI Provider
    if (model_provider === 'openai') {
      const openAiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAiKey) throw new Error("OPENAI_API_KEY is not set");

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model_name || 'gpt-4o',
          temperature: temperature || 0.7,
          messages: [
            { role: 'system', content: fullSystemPrompt },
            { role: 'user', content: message }
          ]
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      reply = data.choices[0].message.content;

    } else if (model_provider === 'google') {
      const geminiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiKey) throw new Error("GEMINI_API_KEY is not set");
      
      const geminiModel = model_name || 'gemini-1.5-pro-latest';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: fullSystemPrompt }] },
          contents: [{ parts: [{ text: message }] }],
          generationConfig: { temperature: temperature || 0.7 }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      reply = data.candidates[0].content.parts[0].text;

    } else {
      throw new Error(`Provider ${model_provider} not supported yet.`);
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in chat-agent:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
