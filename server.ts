import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { analyzeJobOffer, verifyCompanyClaims, runRedTeamReview } from './src/lib/ai/gemini';
import { calculateThreatIndex } from './src/lib/scoring/risk-engine';
import { redactSensitiveData } from './src/lib/security/redaction';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON bodies up to 15MB for base64 screenshots and PDF files
  app.use(express.json({ limit: '15mb' }));

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'SCAMTRACE AI Investigation Engine',
      timestamp: new Date().toISOString(),
    });
  });

  // POST /api/analyze - Main investigation analysis endpoint
  app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, url, fileBase64, mimeType, fileName, inputMode = 'text' } = req.body;

      if (!text && !url && !fileBase64) {
        res.status(400).json({ error: 'Please provide text, a URL, or an uploaded document/image to analyze.' });
        return;
      }

      // Run Gemini Evidence Extraction
      const analysis = await analyzeJobOffer({
        text,
        url,
        fileBase64,
        mimeType,
      });

      // Calculate Deterministic Threat Index
      const threatIndex = calculateThreatIndex(analysis);

      // Sanitize logged text for privacy compliance
      if (text) {
        console.log(`[SCAMTRACE Audit] Analyzed text query. Redacted preview: ${redactSensitiveData(text).slice(0, 100)}... Score: ${threatIndex.score}/100`);
      } else if (url) {
        console.log(`[SCAMTRACE Audit] Analyzed URL: ${url}. Score: ${threatIndex.score}/100`);
      } else if (fileName) {
        console.log(`[SCAMTRACE Audit] Analyzed Document: ${fileName} (${mimeType}). Score: ${threatIndex.score}/100`);
      }

      res.json({
        id: `inv-${Date.now()}`,
        timestamp: new Date().toISOString(),
        inputMode,
        originalInput: text || url || fileName || 'Uploaded Document',
        fileName,
        analysis,
        threatIndex,
      });
    } catch (error: any) {
      console.error('Error in /api/analyze:', error);
      res.status(500).json({
        error: error.message || 'An unexpected error occurred during the scam investigation.',
      });
    }
  });

  // POST /api/verify - Google Search Grounded Company Verification
  app.post('/api/verify', async (req: Request, res: Response): Promise<void> => {
    try {
      const { company, role, domain, claims } = req.body;

      if (!company) {
        res.status(400).json({ error: 'Company name is required for independent verification.' });
        return;
      }

      const verification = await verifyCompanyClaims({
        company,
        role,
        domain,
        claims,
      });

      res.json({ verification });
    } catch (error: any) {
      console.error('Error in /api/verify:', error);
      res.status(500).json({
        error: error.message || 'Unable to complete company verification at this time.',
      });
    }
  });

  // POST /api/red-team - Adversarial AI Challenge
  app.post('/api/red-team', async (req: Request, res: Response): Promise<void> => {
    try {
      const { originalOffer, initialAnalysis, initialScore } = req.body;

      if (!initialAnalysis) {
        res.status(400).json({ error: 'Initial analysis is required for adversarial red-team review.' });
        return;
      }

      const redTeam = await runRedTeamReview({
        originalOffer: originalOffer || 'Candidate job offer',
        initialAnalysis,
        initialScore: typeof initialScore === 'number' ? initialScore : 50,
      });

      res.json({ redTeam });
    } catch (error: any) {
      console.error('Error in /api/red-team:', error);
      res.status(500).json({
        error: error.message || 'Red team adversarial review failed to execute.',
      });
    }
  });

  // POST /api/simulate - Pure Deterministic Recalculation (Risk Simulator)
  app.post('/api/simulate', (req: Request, res: Response): void => {
    try {
      const { analysis, activeFactorIds } = req.body;

      if (!analysis) {
        res.status(400).json({ error: 'Analysis object is required for simulation.' });
        return;
      }

      const recalculated = calculateThreatIndex(analysis, activeFactorIds);
      res.json({ threatIndex: recalculated });
    } catch (error: any) {
      console.error('Error in /api/simulate:', error);
      res.status(500).json({ error: 'Failed to simulate risk calculation.' });
    }
  });

  // Vite middleware for development vs static build serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = http.createServer(app);

  // WebSocket Server for Gemini 3.8 Live API Voice Interactions
  const wss = new WebSocketServer({ server, path: '/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[SCAMTRACE Live] Client connected to WebSocket /live');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' }));
      clientWs.close();
      return;
    }

    let session: any = null;
    let isClosed = false;

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are the SCAMTRACE Live Forensic Voice Investigator.
You are in a live, real-time voice call with a job seeker or victim analyzing suspicious job offers, interview demands, check/crypto payment scams, telegram/whatsapp recruiter pitches, and fake company domains.
Speak naturally, clearly, and concisely (1-3 sentences per turn). Give immediate, actionable red-flag analysis.
If they mention paying for equipment, cashing a check, or moving to Telegram, immediately alert them to the danger.`,
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            const text = message.serverContent?.modelTurn?.parts?.find((p: any) => p.text)?.text;
            if (audio) {
              clientWs.send(JSON.stringify({ audio, text }));
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ turnComplete: true }));
            }
          },
          onclose: () => {
            if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ status: 'live_closed' }));
            }
          },
          onerror: (err: any) => {
            console.error('[SCAMTRACE Live] Gemini Live error:', err);
            if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ error: err?.message || 'Live session error' }));
            }
          },
        },
      });

      clientWs.send(JSON.stringify({
        status: 'connected',
        model: 'gemini-3.8-live',
        message: 'Live Voice Forensic Investigator active. Speak into your microphone.',
      }));

      clientWs.on('message', (data: Buffer | string) => {
        try {
          const payload = JSON.parse(data.toString());
          if (payload.audio && session) {
            session.sendRealtimeInput({
              audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (payload.text && session) {
            session.sendClientContent({
              turns: [
                {
                  role: 'user',
                  parts: [{ text: payload.text }],
                },
              ],
              turnComplete: true,
            });
          }
        } catch (err) {
          console.error('[SCAMTRACE Live] Error parsing client message:', err);
        }
      });

      clientWs.on('close', () => {
        isClosed = true;
        if (session && typeof session.close === 'function') {
          try {
            session.close();
          } catch (e) {}
        }
      });

      clientWs.on('error', (err) => {
        console.error('[SCAMTRACE Live] Client socket error:', err);
      });
    } catch (err: any) {
      console.error('[SCAMTRACE Live] Failed to connect to Gemini Live API:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: err?.message || 'Failed to start Live Voice session' }));
        clientWs.close();
      }
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[SCAMTRACE Engine] Server running on http://0.0.0.0:${PORT} with WebSocket /live`);
  });
}

startServer();
