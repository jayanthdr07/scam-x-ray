import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  X,
  PhoneOff,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Zap,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { pcm16ToBase64, LiveAudioQueuePlayer } from '../lib/audio/live-audio';
import { InvestigationSession } from '../types/analysis';

interface LiveVoiceInvestigatorProps {
  isOpen: boolean;
  onClose: () => void;
  activeSession?: InvestigationSession | null;
}

interface TranscriptEntry {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
}

export const LiveVoiceInvestigator: React.FC<LiveVoiceInvestigatorProps> = ({
  isOpen,
  onClose,
  activeSession,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatusText, setConnectionStatusText] = useState('Standby');
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([
    {
      id: 'welcome',
      sender: 'system',
      text: 'SCAMTRACE Live Voice Investigator initialized. Powered by Gemini 3.8 Live API.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<LiveAudioQueuePlayer | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcripts
  useEffect(() => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Cleanup on unmount or close
  const cleanupLiveSession = useCallback(() => {
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch (e) {}
      scriptProcessorRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch (e) {}
      inputAudioCtxRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    if (playerRef.current) {
      playerRef.current.close();
      playerRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setIsMicActive(false);
    setIsAgentSpeaking(false);
    setAudioLevel(0);
    setConnectionStatusText('Call Ended');
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cleanupLiveSession();
    }
  }, [isOpen, cleanupLiveSession]);

  // Connect to Gemini 3.8 Live WebSocket
  const startLiveSession = async () => {
    try {
      setErrorMessage(null);
      setIsConnecting(true);
      setConnectionStatusText('Negotiating real-time socket connection...');

      // 1. Initialize Player for 24kHz responses
      playerRef.current = new LiveAudioQueuePlayer(24000);
      await playerRef.current.resume();

      // 2. Establish WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = async () => {
        setIsConnecting(false);
        setIsConnected(true);
        setConnectionStatusText('Live Channel Connected');

        // Request microphone stream
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1,
            },
          });
          micStreamRef.current = stream;

          // Setup 16kHz audio capture
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const inputCtx = new AudioContextClass({ sampleRate: 16000 });
          inputAudioCtxRef.current = inputCtx;

          const source = inputCtx.createMediaStreamSource(stream);
          // Script processor with 4096 buffer size
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (isMuted || ws.readyState !== WebSocket.OPEN) return;

            const channelData = e.inputBuffer.getChannelData(0);

            // Compute RMS volume level for UI visualizer
            let sum = 0;
            for (let i = 0; i < channelData.length; i++) {
              sum += channelData[i] * channelData[i];
            }
            const rms = Math.sqrt(sum / channelData.length);
            setAudioLevel(Math.min(1, rms * 5));

            // Convert and transmit PCM base64
            const base64 = pcm16ToBase64(channelData);
            ws.send(JSON.stringify({ audio: base64 }));
          };

          source.connect(processor);
          processor.connect(inputCtx.destination);
          setIsMicActive(true);

          // If there is an active session, inject a starting context prompt
          if (activeSession) {
            const contextMsg = `Active Job Scam Analysis context: Candidate is evaluating an offer from "${activeSession.analysis.claimedCompany || 'an unverified company'}" for the role of "${activeSession.analysis.claimedRole || 'unspecified'}". Risk level is ${activeSession.threatIndex.band} (${activeSession.threatIndex.score}/100). The user is on the line now.`;
            ws.send(JSON.stringify({ text: contextMsg }));
          }
        } catch (micErr: any) {
          console.error('[LiveVoice] Mic access error:', micErr);
          setErrorMessage('Microphone access denied or unavailable. You can still type prompts or inspect transcripts.');
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.error) {
            setErrorMessage(msg.error);
            return;
          }

          if (msg.status === 'connected') {
            setConnectionStatusText('Voice Agent Ready');
            setTranscripts((prev) => [
              ...prev,
              {
                id: `status-${Date.now()}`,
                sender: 'agent',
                text: "Hello! I'm your SCAMTRACE Forensic Voice Investigator. What does your job offer or recruiter interaction look like?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }

          if (msg.audio && playerRef.current) {
            setIsAgentSpeaking(true);
            playerRef.current.playChunk(msg.audio);
          }

          if (msg.text) {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'agent') {
                return [...prev.slice(0, -1), { ...last, text: last.text + ' ' + msg.text }];
              }
              return [
                ...prev,
                {
                  id: `agent-${Date.now()}`,
                  sender: 'agent',
                  text: msg.text,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ];
            });
          }

          if (msg.interrupted) {
            if (playerRef.current) {
              playerRef.current.stopAll();
            }
            setIsAgentSpeaking(false);
          }

          if (msg.turnComplete) {
            setIsAgentSpeaking(false);
          }
        } catch (err) {
          console.error('[LiveVoice] Error parsing socket payload:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('[LiveVoice] WebSocket error:', err);
        setErrorMessage('Voice connection encountered an error.');
        cleanupLiveSession();
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsMicActive(false);
        setConnectionStatusText('Session Disconnected');
      };
    } catch (err: any) {
      console.error('[LiveVoice] Failed to start live session:', err);
      setErrorMessage(err.message || 'Unable to establish live audio session.');
      cleanupLiveSession();
    }
  };

  const handleSendQuickScenario = (promptText: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setErrorMessage('Please start the live voice call first.');
      return;
    }

    setTranscripts((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    socketRef.current.send(JSON.stringify({ text: promptText }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Live Voice Forensic Investigator
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
                  GEMINI 3.8 LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Low-latency, real-time audio conversation for rapid scam triage and interrogation.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cleanupLiveSession();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Close Live Investigator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="px-6 py-2.5 bg-rose-950/50 border-b border-rose-900/60 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 text-xs underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Audio Visualizer Stage */}
        <div className="px-6 py-6 bg-gradient-to-b from-slate-950 to-slate-900/60 border-b border-slate-800/80 flex flex-col items-center justify-center">
          {/* Waveform / Visualizer Orb */}
          <div className="relative flex items-center justify-center mb-4">
            {/* Outer halo */}
            <div
              className={`w-28 h-28 rounded-full border transition-all duration-300 flex items-center justify-center ${
                isConnected
                  ? isAgentSpeaking
                    ? 'border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                    : 'border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                  : 'border-slate-700 bg-slate-950/40'
              }`}
            >
              {/* Inner core */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isConnected
                    ? isAgentSpeaking
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white scale-105'
                      : 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
                style={{
                  transform: isConnected ? `scale(${1 + audioLevel * 0.25})` : 'scale(1)',
                }}
              >
                {isConnecting ? (
                  <Sparkles className="w-8 h-8 animate-spin text-cyan-200" />
                ) : isConnected ? (
                  isAgentSpeaking ? (
                    <Volume2 className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )
                ) : (
                  <MicOff className="w-8 h-8 text-slate-400" />
                )}
              </div>
            </div>

            {/* Simulated Live Audio Spectrum Bars */}
            {isConnected && (
              <div className="absolute -bottom-2 flex items-center gap-1">
                {[4, 8, 14, 20, 16, 24, 18, 12, 6].map((h, i) => {
                  const scale = isAgentSpeaking
                    ? 0.4 + Math.sin(Date.now() / 150 + i) * 0.5 + 0.4
                    : isMicActive
                    ? 0.3 + audioLevel * 1.5
                    : 0.2;
                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        isAgentSpeaking ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{
                        height: `${Math.max(4, h * scale)}px`,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Label */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected
                    ? isAgentSpeaking
                      ? 'bg-emerald-400'
                      : 'bg-cyan-400'
                    : isConnecting
                    ? 'bg-amber-400'
                    : 'bg-slate-600'
                }`}
              />
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-300">
                {connectionStatusText}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isConnected
                ? isAgentSpeaking
                  ? 'AI Investigator is speaking (Live audio 24kHz stream)...'
                  : 'Listening to your microphone (16kHz PCM stream). Ask anything.'
                : 'Press "Start Live Call" to begin speaking with Gemini 3.8 Live'}
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-3 mt-4">
            {!isConnected ? (
              <button
                onClick={startLiveSession}
                disabled={isConnecting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/40 transition disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Start Live Call
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-xl border transition ${
                    isMuted
                      ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={cleanupLiveSession}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-rose-900/30 transition"
                >
                  <PhoneOff className="w-4 h-4" />
                  End Call
                </button>
              </>
            )}

            {activeSession && (
              <button
                onClick={() => {
                  if (socketRef.current?.readyState === WebSocket.OPEN) {
                    const topFactors = activeSession.threatIndex.factorContributions
                      .slice(0, 3)
                      .map((f: { title: string }) => f.title)
                      .join(', ');
                    const ctxText = `Reviewing detected scam: Company: "${activeSession.analysis.claimedCompany || 'Unverified'}", Role: "${activeSession.analysis.claimedRole || 'Unknown'}", Threat Index: ${activeSession.threatIndex.score}/100. Primary Red Flags: ${topFactors}.`;
                    handleSendQuickScenario(ctxText);
                  }
                }}
                disabled={!isConnected}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition disabled:opacity-40"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Inject Current Scan Context
              </button>
            )}
          </div>
        </div>

        {/* Live Transcript Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[300px] bg-slate-950/30">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-cyan-400" />
            Live Session Transcript
          </div>

          {transcripts.map((entry) => (
            <div
              key={entry.id}
              className={`flex flex-col ${
                entry.sender === 'user'
                  ? 'items-end'
                  : entry.sender === 'agent'
                  ? 'items-start'
                  : 'items-center'
              }`}
            >
              {entry.sender === 'system' ? (
                <div className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-[10px] text-slate-400 font-mono">
                  {entry.text}
                </div>
              ) : (
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                    entry.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1 font-mono">
                    <span>{entry.sender === 'user' ? 'You (Spoken)' : 'AI Investigator'}</span>
                    <span>{entry.timestamp}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={transcriptsEndRef} />
        </div>

        {/* Tactical Quick Scam Scenarios */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80">
          <div className="text-[10px] uppercase font-mono text-slate-400 mb-2 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            Tap to Ask Common Scam Scenarios:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              'They sent a check to buy office equipment.',
              'Interview was on Telegram text only.',
              'Offered $75/hr for data entry with no call.',
              'Asking for a $100 screening/background fee.',
              'Email domain is @company-careers-hr.com.',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendQuickScenario(prompt)}
                disabled={!isConnected}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-[11px] text-slate-300 hover:text-white transition disabled:opacity-40"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
