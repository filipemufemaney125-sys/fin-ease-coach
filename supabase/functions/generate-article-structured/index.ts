import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { topic, model } = await req.json();
    if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Please provide a valid topic (min 3 characters).' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service is not configured.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are an elite SEO content writer for NextGen Moz, a premium AI & technology blog.
Write professional, human-like, long-form articles (1200-1800 words) that rank on Google.
Voice: confident, modern, data-driven. Avoid clichés ("In today's fast-paced world", "delve into", "moreover").
Use concrete examples, numbers, and authoritative tone.
Always return your output by calling the create_article tool — never reply in plain text.`;

    const userPrompt = `Write a complete, SEO-optimized blog article about: "${topic.trim()}".

The article body (markdown) MUST include in this order:
1. A compelling 2-3 paragraph Introduction (no heading needed before it, start directly)
2. 3-5 "## H2" main sections with substantive analysis, examples, and at least one "### H3" subsection
3. A "## Frequently Asked Questions" section with 4 "### Question" / answer pairs
4. A "## Conclusion" section with key takeaways and a forward-looking statement

Do NOT include the title as an H1 in the body — the title is a separate field.`;

    const tools = [{
      type: 'function',
      function: {
        name: 'create_article',
        description: 'Return the SEO-optimized article as structured fields.',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'SEO title, max 70 chars, includes main keyword.' },
            slug: { type: 'string', description: 'URL slug: lowercase, words separated by hyphens, no special chars.' },
            excerpt: { type: 'string', description: 'Short summary, 140-180 chars.' },
            seo_title: { type: 'string', description: 'SEO meta title, max 60 chars.' },
            seo_description: { type: 'string', description: 'Meta description, 150-160 chars.' },
            tags: { type: 'array', items: { type: 'string' }, description: '3-6 lowercase keyword tags.' },
            reading_minutes: { type: 'integer', description: 'Estimated reading time in minutes (5-12).' },
            content: { type: 'string', description: 'Full article body in Markdown. Excludes the H1 title.' },
          },
          required: ['title', 'slug', 'excerpt', 'seo_title', 'seo_description', 'tags', 'reading_minutes', 'content'],
          additionalProperties: false,
        },
      },
    }];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools,
        tool_choice: { type: 'function', function: { name: 'create_article' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Add credits in workspace settings.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errText = await response.text();
      console.error('AI gateway error:', response.status, errText);
      return new Response(JSON.stringify({ error: 'Failed to generate article.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error('No tool call in response:', JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'AI did not return a structured article.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let article;
    try {
      article = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error('Failed to parse tool arguments:', toolCall.function.arguments);
      return new Response(JSON.stringify({ error: 'Invalid article format from AI.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Normalize slug
    if (article.slug) {
      article.slug = String(article.slug).toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    return new Response(JSON.stringify({ article }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('generate-article-structured error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});