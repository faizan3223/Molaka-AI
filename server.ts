import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client according to instructions
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt that gives Mokola AI's signature warm, precise, intellectual persona
const MOKOLA_SYSTEM_INSTRUCTION = `You are Mokola AI, the world's most advanced, thoughtful, and lightning-fast AI system.
You provide world-class answers with deep intellectual depth, nuance, clarity, and warm empathetic tone.

CRITICAL INSTRUCTIONS FOR ARTIFACTS & CODE:
When the user asks for an application, component, visualization, game, tool, website, or script:
1. Always write COMPLETE, PRODUCTION-READY, FULLY FUNCTIONAL code. Never use placeholder comments like "/* implement logic here */".
2. Prefer self-contained HTML/CSS/JavaScript with Tailwind CSS or React (using React 18/19 via CDN or vanilla browser APIs, Canvas, WebGL, SVG) so it can be previewed directly in the live Artifact interactive viewer.
3. Wrap your code in standard markdown code fences with the language identifier (e.g. \`\`\`html, \`\`\`tsx, \`\`\`jsx, \`\`\`javascript, \`\`\`svg, \`\`\`python, \`\`\`css, \`\`\`json).
4. If generating HTML, include a full <!DOCTYPE html> document with modern styles, fonts, and responsiveness.
5. In addition to English, you seamlessly understand and answer in Urdu, Roman Urdu, and multilingual requests naturally when the user addresses you in those languages.`;

// 1. Streaming Chat Endpoint (SSE)
app.post('/api/chat', async (req, res) => {
  const { messages, model = 'gemini-3.8-flash', thinking = true, webSearch = false } = req.body;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  // Format contents for @google/genai
  const contents = (messages || []).map((msg: { role: string; content: string }) => ({
    role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const config: any = {
      systemInstruction: MOKOLA_SYSTEM_INSTRUCTION,
      temperature: 0.7,
    };

    if (webSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const targetModels = [
      model,
      'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
    ].filter((m, i, arr) => arr.indexOf(m) === i);

    let streamSuccess = false;
    let lastError: any = null;

    for (const currentTryModel of targetModels) {
      try {
        const responseStream = await ai.models.generateContentStream({
          model: currentTryModel,
          contents,
          config,
        });

        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }

        streamSuccess = true;
        break; // Successfully streamed!
      } catch (err: any) {
        console.warn(`Model ${currentTryModel} attempt failed:`, err.message || err);
        lastError = err;
        // Continue to fallback model
      }
    }

    if (!streamSuccess) {
      const errMsg = lastError?.message || 'Temporary high demand. Please try sending again in a few seconds.';
      res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    console.error('Fatal chat endpoint error:', err);
    res.write(`data: ${JSON.stringify({ error: err.message || 'Server error' })}\n\n`);
    res.end();
  }
});

// 2. Image Generation Endpoint
app.post('/api/generate-image', async (req, res) => {
  const { prompt, aspectRatio = '1:1' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl = '';
    let description = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        description += part.text;
      }
    }

    if (imageUrl) {
      return res.json({ success: true, imageUrl, description });
    } else {
      return res.status(500).json({ error: 'No image data returned from model', description });
    }
  } catch (err: any) {
    console.warn('Image generation warning/fallback:', err.message);
    // If paid model is not configured or quota exceeded, provide a descriptive message
    return res.status(500).json({
      error: err.message || 'Image generation failed',
      requiresPaidKey: err.message?.includes('API key') || err.message?.includes('billed') || err.message?.includes('quota'),
    });
  }
});

// 3. Text to Speech Endpoint (Claude Voice)
app.post('/api/tts', async (req, res) => {
  const { text, voice = 'Kore' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const cleanText = text.slice(0, 800).replace(/```[\s\S]*?```/g, 'Code snippet.');
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text: cleanText }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice as any },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: `data:audio/wav;base64,${base64Audio}` });
    }
    return res.status(500).json({ error: 'No audio returned' });
  } catch (err: any) {
    console.error('TTS error:', err);
    return res.status(500).json({ error: err.message || 'TTS generation failed' });
  }
});

// 4. Video Generation & Motion Scripting Endpoint
app.post('/api/generate-video', async (req, res) => {
  const { prompt, style = 'cinematic', duration = 5 } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Attempt Veo video generation if available
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: `${prompt}, ${style} lighting, 4k ultra-detailed, smooth motion`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9',
      },
    });

    return res.json({ success: true, operationName: operation.name, mode: 'veo' });
  } catch (err: any) {
    console.warn('Veo preview not available or requires paid key, returning motion canvas synthesis instructions:', err.message);
    return res.json({
      success: false,
      fallbackMode: 'simulation',
      error: err.message,
      prompt,
      message: 'Veo video requires paid model activation. Live interactive 60fps canvas simulation is activated.',
    });
  }
});

// Polling for video generation
app.post('/api/video-status', async (req, res) => {
  const { operationName } = req.body;
  if (!operationName) return res.status(400).json({ error: 'Missing operationName' });

  try {
    const { GenerateVideosOperation } = await import('@google/genai');
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    return res.json({ done: updated.done, response: updated.response });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Claude Studio server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
