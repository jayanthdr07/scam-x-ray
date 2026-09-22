import React, { useState } from 'react';
import { X, Terminal, CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';

interface EmailHeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailHeaderModal: React.FC<EmailHeaderModalProps> = ({ isOpen, onClose }) => {
  const [headerText, setHeaderText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    spf: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE';
    dkim: 'PASS' | 'FAIL' | 'NONE';
    dmarc: 'PASS' | 'FAIL' | 'NONE';
    fromHeader: string;
    returnPath: string;
    isMismatch: boolean;
    senderIp: string;
  } | null>(null);

  if (!isOpen) return null;

  const analyzeHeaders = () => {
    if (!headerText.trim()) return;

    const lower = headerText.toLowerCase();

    // Extract From
    const fromMatch = headerText.match(/From:\s*([^\r\n]+)/i);
    const fromHeader = fromMatch ? fromMatch[1].trim() : 'Not detected';

    // Extract Return-Path
    const returnMatch = headerText.match(/Return-Path:\s*<([^>]+)>/i) || headerText.match(/Return-Path:\s*([^\r\n]+)/i);
    const returnPath = returnMatch ? returnMatch[1].trim() : 'Not detected';

    // Detect SPF
    let spf: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE' = 'NONE';
    if (lower.includes('spf=pass') || lower.includes('received-spf: pass')) spf = 'PASS';
    else if (lower.includes('spf=fail') || lower.includes('received-spf: fail')) spf = 'FAIL';
    else if (lower.includes('spf=softfail')) spf = 'SOFTFAIL';

    // Detect DKIM
    let dkim: 'PASS' | 'FAIL' | 'NONE' = 'NONE';
    if (lower.includes('dkim=pass') || lower.includes('header.d=')) dkim = 'PASS';
    else if (lower.includes('dkim=fail')) dkim = 'FAIL';

    // Detect DMARC
    let dmarc: 'PASS' | 'FAIL' | 'NONE' = 'NONE';
    if (lower.includes('dmarc=pass')) dmarc = 'PASS';
    else if (lower.includes('dmarc=fail')) dmarc = 'FAIL';

    // Check From vs Return-Path mismatch
    const fromDomain = fromHeader.split('@')[1]?.replace(/[>\]\s]/g, '') || '';
    const returnDomain = returnPath.split('@')[1]?.replace(/[>\]\s]/g, '') || '';
    const isMismatch = Boolean(fromDomain && returnDomain && !returnDomain.includes(fromDomain) && !fromDomain.includes(returnDomain));

    // Extract IP
    const ipMatch = headerText.match(/client-ip=([0-9.]+)/i) || headerText.match(/received:\s*from[^[]*\[([0-9.]+)\]/i);
    const senderIp = ipMatch ? ipMatch[1] : 'Unknown';

    setAnalysisResult({
      spf,
      dkim,
      dmarc,
      fromHeader,
      returnPath,
      isMismatch,
      senderIp,
    });
  };

  const loadSampleSpoofedHeader = () => {
    const sample = `Delivered-To: candidate@myinbox.com
Received: by 2002:a05:6808:1c88:b0:3bb:9c79:844c with SMTP id h8csp1234
Received: from mail.cheaphostingserver.xyz (mail.cheaphostingserver.xyz. [198.51.100.42])
    by mx.google.com with ESMTP id z12si3456
Authentication-Results: mx.google.com;
    spf=fail (google.com: domain of support@cheaphostingserver.xyz does not designate 198.51.100.42 as permitted sender) smtp.mailfrom=support@cheaphostingserver.xyz;
    dkim=fail header.i=@stripe-recruiting.com;
    dmarc=fail (p=REJECT sp=REJECT dis=NONE) header.from=stripe-recruiting.com
Return-Path: <spoofed-bounce@cheaphostingserver.xyz>
From: Stripe Recruitment Team <hr@stripe-recruiting.com>
To: candidate@myinbox.com
Subject: Immediate Job Offer: Software Engineer`;
    setHeaderText(sample);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="cyber-card rounded-2xl border border-cyan-500/30 w-full max-w-2xl bg-slate-950 p-6 shadow-2xl relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
              EMAIL HEADER SPOOFING INSPECTOR
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 font-mono mb-3">
          Paste raw RFC 822 email headers to detect forged sender addresses, SPF failures, and DKIM spoofing.
        </p>

        {/* Input area */}
        <textarea
          rows={6}
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          placeholder="Paste raw email headers (Received:, Authentication-Results:, From:, Return-Path:)..."
          className="w-full rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs font-mono text-slate-200 p-3 mb-3 resize-y"
        />

        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={loadSampleSpoofedHeader}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            Load Sample Spoofed Header
          </button>

          <button
            type="button"
            onClick={analyzeHeaders}
            disabled={!headerText.trim()}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors disabled:opacity-50"
          >
            Inspect Authentication
          </button>
        </div>

        {/* Results */}
        {analysisResult && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="block text-[10px] text-slate-500">SPF STATUS</span>
                <strong className={analysisResult.spf === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>
                  {analysisResult.spf}
                </strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="block text-[10px] text-slate-500">DKIM STATUS</span>
                <strong className={analysisResult.dkim === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>
                  {analysisResult.dkim}
                </strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="block text-[10px] text-slate-500">DMARC STATUS</span>
                <strong className={analysisResult.dmarc === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>
                  {analysisResult.dmarc}
                </strong>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800 text-slate-300 text-[11px]">
              <p><strong>Claimed Sender (From):</strong> {analysisResult.fromHeader}</p>
              <p><strong>Actual Envelope (Return-Path):</strong> {analysisResult.returnPath}</p>
              <p><strong>Origin IP:</strong> {analysisResult.senderIp}</p>
              {analysisResult.isMismatch && (
                <p className="text-rose-400 font-bold mt-1">
                  ⚠️ ALARM: The From header domain does not match the actual mail server envelope (Return-Path). Classic impersonation indicator.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
