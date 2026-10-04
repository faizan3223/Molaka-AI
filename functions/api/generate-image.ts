export async function onRequestPost(context: any) {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY || '';

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { prompt, aspectRatio = '1:1' } = await request.json();

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;

    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'aistudio-build' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data: any = await res.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    let imageUrl = '';

    for (const part of parts) {
      if (part.inlineData?.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (imageUrl) {
      return new Response(JSON.stringify({ success: true, imageUrl }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, fallbackMode: 'simulation' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, fallbackMode: 'simulation' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
