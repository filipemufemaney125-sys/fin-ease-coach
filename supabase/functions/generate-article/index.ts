import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Please provide a valid topic (min 3 characters).' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service is not configured.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are an elite SEO content writer for NextGen Moz, a premium AI & technology blog. Write professional, human-like, engaging articles that rank on Google.

Rules:
- Write in clear, natural English with a confident, modern voice.
- Avoid AI clichés ("In today's fast-paced world", "delve into", "moreover").
- Use real-world examples, concrete numbers, and authoritative tone.
- SEO-optimized: keyword-rich title, semantic headings, scannable structure.
- Output ONLY valid Markdown. No preamble, no explanations.

Required structure:
# {SEO Title (under 60 chars, includes main keyword)}

*Meta description: {compelling 150-160 char summary}*

## Introduction
{2-3 paragraph hook explaining why this matters now}

## {H2 Section 1}
{detailed content with examples}

## {H2 Section 2}
{detailed content}

### {H3 Subsection}
{deeper analysis}

## {H2 Section 3}
{actionable insights}

## Frequently Asked Questions

### {Question 1}
{concise answer}

### {Question 2}
{concise answer}

### {Question 3}
{concise answer}

### {Question 4}
{concise answer}

## Conclusion
{strong closing with key takeaways and a forward-looking statement}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Write a complete, SEO-optimized blog article about: "${topic.trim()}"` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errText = await response.text();
      console.error('AI gateway error:', response.status, errText);
      return new Response(JSON.stringify({ error: 'Failed to generate article.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const article = data.choices?.[0]?.message?.content ?? '';

    return new Response(JSON.stringify({ article }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('generate-article error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});