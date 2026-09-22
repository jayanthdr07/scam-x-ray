import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Scanner } from './components/Scanner';
import { ScamPatternLibrary } from './components/ScamPatternLibrary';
import { SmartAlert, InterceptedAction } from './components/SmartAlert';
import { ThreatIndex } from './components/ThreatIndex';
import { TopRedFlags } from './components/TopRedFlags';
import { EvidenceLens } from './components/EvidenceLens';
import { AttackChain } from './components/AttackChain';
import { ScamDnaRadar } from './components/ScamDnaRadar';
import { VerificationPanel } from './components/VerificationPanel';
import { RedTeamPanel } from './components/RedTeamPanel';
import { RiskSimulator } from './components/RiskSimulator';
import { ProtectionPlan } from './components/ProtectionPlan';
import { EmailHeaderModal } from './components/EmailHeaderModal';
import { Footer } from './components/Footer';
import { AccordionItem } from './components/ui/Accordion';
import { InvestigationSession, VerificationResult, RedTeamReview } from './types/analysis';
import { AlertCircle, RotateCcw, Share2, Check } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<InvestigationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedTeaming, setIsRedTeaming] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportExported, setReportExported] = useState(false);
  const [externalInputText, setExternalInputText] = useState<string | undefined>(undefined);
  const [interceptedAction, setInterceptedAction] = useState<InterceptedAction | null>(null);
  const [selectedEvidenceSignalId, setSelectedEvidenceSignalId] = useState<string | undefined>(undefined);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Real-time Smart Alert Interception for links/actions
  const triggerSmartAlert = (url: string, reason?: string, severity: 'critical' | 'high' = 'high') => {
    setInterceptedAction({
      id: 'alert-' + Date.now(),
      url,
      reason: reason || 'Destination flagged by SCAMTRACE AI engine for suspicious recruitment evasion or unverified credential request.',
      category: url.includes('t.me') || url.includes('telegram') ? 'off_platform' :
                url.includes('upi') || url.includes('wire') || url.includes('fee') ? 'financial' : 'domain',
      severity,
      timestamp: Date.now(),
    });
  };

  // Intercept any high-risk links clicked across the page
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      const lowerHref = href.toLowerCase();
      const isDangerous =
        lowerHref.includes('t.me') ||
        lowerHref.includes('telegram') ||
        lowerHref.includes('fakeupi') ||
        lowerHref.includes('bit.ly') ||
        lowerHref.includes('tinyurl') ||
        lowerHref.includes('verify-candidate') ||
        lowerHref.includes('accredited-training') ||
        lowerHref.includes('screening') ||
        (session && session.threatIndex.score >= 55 && !lowerHref.includes('google.com/search') && !lowerHref.includes('linkedin.com/company'));

      if (isDangerous) {
        e.preventDefault();
        e.stopPropagation();
        triggerSmartAlert(
          href,
          `High-risk external link intercepted: "${href}". This URL matches deceptive recruitment patterns or off-platform communication evasion.`,
          session && session.threatIndex.score >= 70 ? 'critical' : 'high'
        );
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, [session]);

  // Main Investigation Handler
  const handleInvestigate = async (params: {
    inputMode: 'text' | 'url' | 'pdf' | 'image';
    text?: string;
    url?: string;
    fileBase64?: string;
    mimeType?: string;
    fileName?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('🔍 Reading offer input...');

    const stepTimer1 = setTimeout(() => setLoadingStep('🧠 Extracting risk signals & entities...'), 1200);
    const stepTimer2 = setTimeout(() => setLoadingStep('🧾 Mapping verifiable evidence quotes...'), 2600);
    const stepTimer3 = setTimeout(() => setLoadingStep('🧬 Computing Scam DNA & attack chain...'), 4200);
    const stepTimer4 = setTimeout(() => setLoadingStep('⚡ Calculating deterministic Threat Index...'), 5800);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Investigation service failed to analyze input.');
      }

      const data = await response.json();
      setSession(data);
      if (data.analysis?.riskSignals?.[0]?.id) {
        setSelectedEvidenceSignalId(data.analysis.riskSignals[0].id);
      }

      // Auto-scroll down smoothly to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);

      // If a company claim was detected, auto-trigger Google Search Verification in background
      if (data.analysis?.claimedCompany && data.analysis.claimedCompany !== 'Unknown') {
        runVerificationInBackground(data.analysis.claimedCompany, data.analysis.claimedRole);
      }
    } catch (err: any) {
      console.error('Investigation error:', err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(stepTimer4);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const runVerificationInBackground = async (company: string, role?: string | null) => {
    try {
      const res = await fetch('/api/verify-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role }),
      });
      if (res.ok) {
        const data = await res.json();
        setSession((prev: InvestigationSession | null) => (prev ? { ...prev, verification: data.verification } : null));
      }
    } catch (e) {
      console.warn('Background verification silent failure:', e);
    }
  };

  const handleRunVerification = async (company: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/verify-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          role: session?.analysis.claimedRole,
        }),
      });
      if (!res.ok) throw new Error('Verification failed.');
      const data = await res.json();
      setSession((prev: InvestigationSession | null) => (prev ? { ...prev, verification: data.verification } : null));
    } catch (err: any) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRunRedTeam = async () => {
    if (!session) return;
    setIsRedTeaming(true);
    try {
      const response = await fetch('/api/red-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: session.originalInput,
          analysis: session.analysis,
          threatScore: session.threatIndex.score,
        }),
      });

      if (!response.ok) {
        throw new Error('Adversarial red team review failed.');
      }

      const data = await response.json();
      setSession((prev: InvestigationSession | null) => (prev ? { ...prev, redTeam: data.redTeam } : null));
    } catch (err: any) {
      console.error('Red team error:', err);
    } finally {
      setIsRedTeaming(false);
    }
  };

  const handleReset = () => {
    setSession(null);
    setError(null);
    setSelectedEvidenceSignalId(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportReport = () => {
    if (!session) return;
    const reportText = `SCAMTRACE FORENSIC INVESTIGATION REPORT
Generated: ${new Date(session.timestamp).toLocaleString()}
Investigation ID: ${session.id}
Input Type: ${session.inputMode}

THREAT ASSESSMENT:
- Threat Index: ${session.threatIndex.score} / 100 (${session.threatIndex.band} RISK)
- Confidence: ${session.threatIndex.confidence}%
- Evidence Quality: ${session.threatIndex.evidenceQuality}
- Claimed Employer: ${session.analysis.claimedCompany || 'Unspecified'}
- Claimed Position: ${session.analysis.claimedRole || 'Unspecified'}

KEY FINDINGS:
${session.threatIndex.factorContributions.map((f: any) => `* [${f.weight} pts] ${f.title}: "${f.evidence}"`).join('\n')}

ATTACK CHAIN PROGRESSION:
${session.analysis.attackChain.map((s: any, i: number) => `${i + 1}. [${s.stage.toUpperCase()}] ${s.title}: ${s.explanation}`).join('\n')}

INVESTIGATION SUMMARY:
${session.analysis.summary}

VERIFICATION STATUS:
${session.verification ? `${session.verification.status}: ${session.verification.verificationSummary}` : 'Not verified yet'}

--------------------------------------------------
Advisory Report by SCAMTRACE (https://ai.studio/build)`;

    navigator.clipboard.writeText(reportText);
    setReportExported(true);
    setTimeout(() => setReportExported(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        onOpenEmailAnalyzer={() => setEmailModalOpen(true)}
        onNavigateToLibrary={() => document.getElementById('pattern-library-section')?.scrollIntoView({ behavior: 'smooth' })}
        onNavigateToScanner={() => document.getElementById('offer-scanner-section')?.scrollIntoView({ behavior: 'smooth' })}
        onNavigateToHowItWorks={() => document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' })}
        onTryDemo={() => {
          setExternalInputText(`Subject: Formal Appointment & Equipment Disbursal - Senior Operations Clerk
Company: Apex Horizon Logistics Ltd.
Dear Candidate,

Congratulations! Following your resume review, our Management Board has approved your appointment as a Remote Operations Clerk with a starting salary of $34/hour.

To prepare your remote workstation, our accounting team has mailed a cashier's check of $4,250 to your residential address. You are required to deposit this check via mobile banking immediately upon receipt. Once the initial credit reflects, you must wire $3,850 to our designated hardware vendor (vendor-support@apex-supplies.net) via Zelle or Wire Transfer within 24 hours to expedite courier dispatch of your Apple MacBook Pro.

Please confirm receipt of this instruction immediately to avoid forfeiture of your role.

Warm regards,
Talent Acquisition Team
Apex Horizon Logistics`);
          document.getElementById('offer-scanner-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. INPUT: Hero + Scanner */}
        <Hero />

        <Scanner
          onInvestigate={handleInvestigate}
          isLoading={isLoading}
          loadingStep={loadingStep}
          externalInputText={externalInputText}
          onExternalInputConsumed={() => setExternalInputText(undefined)}
        />

        {/* Error Notification */}
        {error && (
          <div className="w-full max-w-4xl mx-auto px-4 mb-6">
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-rose-300">Investigation Failed</h4>
                <p className="text-xs text-rose-200 mt-0.5 font-mono">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Investigation Results Section */}
        {session && (
          <div ref={resultsRef} className="pt-6 animate-in fade-in duration-500">
            {/* Action Bar: New Scan + Export Report */}
            <div className="max-w-4xl mx-auto px-4 mb-6 flex flex-wrap items-center justify-between gap-3">
              <button
                id="btn-new-investigation"
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/40 bg-slate-900/60 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Investigate Another Offer</span>
              </button>

              <button
                id="btn-export-report"
                type="button"
                onClick={handleExportReport}
                className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-cyan-200 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-950/70 transition-colors shadow-sm"
              >
                {reportExported ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Report Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Export Forensic Report</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. VERDICT: Score + Risk Band */}
            <ThreatIndex
              threatIndex={session.threatIndex}
              summary={session.analysis.summary}
              claimedCompany={session.analysis.claimedCompany}
              claimedRole={session.analysis.claimedRole}
              location={session.analysis.location}
              salary={session.analysis.salary}
            />

            {/* 3. WHY: Top Red Flags */}
            <TopRedFlags
              signals={session.analysis.riskSignals}
              selectedSignalId={selectedEvidenceSignalId}
              onSelectSignal={(sigId) => {
                setSelectedEvidenceSignalId(sigId);
                document.getElementById('evidence-lens-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 4. EVIDENCE: Evidence Lens */}
            <div id="evidence-lens-section">
              <EvidenceLens
                signals={session.analysis.riskSignals}
                originalText={session.originalInput}
                selectedSignalId={selectedEvidenceSignalId}
                onSelectSignal={setSelectedEvidenceSignalId}
              />
            </div>

            {/* 5. HOW IT WORKS: Attack Chain */}
            <AttackChain steps={session.analysis.attackChain} />

            {/* 6. PATTERN: Scam DNA */}
            <ScamDnaRadar dna={session.analysis.scamDna} />

            {/* 7. VERIFICATION: Company / Domain Checks */}
            <VerificationPanel
              claimedCompany={session.analysis.claimedCompany}
              claimedRole={session.analysis.claimedRole}
              verification={session.verification}
              onRunVerification={handleRunVerification}
              isVerifying={isVerifying}
            />

            {/* 8. ADVANCED: Red Team / Simulator - Collapsible */}
            <div className="w-full max-w-4xl mx-auto px-4 mb-8">
              <AccordionItem
                id="advanced-investigation"
                title="Advanced Investigation"
                subtitle="AI Red Team contrarian review & interactive risk simulation"
                defaultOpen={false}
              >
                <div className="space-y-4 pt-3">
                  <RedTeamPanel
                    redTeam={session.redTeam}
                    onRunRedTeam={handleRunRedTeam}
                    isRunning={isRedTeaming}
                    initialScore={session.threatIndex.score}
                  />
                  <RiskSimulator
                    analysis={session.analysis}
                    initialThreatIndex={session.threatIndex}
                  />
                </div>
              </AccordionItem>
            </div>

            {/* 9. ACTION: Protection Plan - What to do now */}
            <ProtectionPlan claimedCompany={session.analysis.claimedCompany} />
          </div>
        )}

        {/* 10. LEARN: Pattern Library (Always accessible at bottom) */}
        <ScamPatternLibrary
          onLoadExampleInScanner={(sampleText) => {
            setExternalInputText(sampleText);
            document.getElementById('offer-scanner-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      {/* Real-time Smart Alert */}
      <SmartAlert
        interceptedAction={interceptedAction}
        onDismiss={() => setInterceptedAction(null)}
        onProceedAnyway={(url) => {
          window.open(url, '_blank', 'noopener,noreferrer');
        }}
      />

      {/* Email Header Spoofing Modal */}
      <EmailHeaderModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
