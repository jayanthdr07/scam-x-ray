import React, { useState, useRef } from 'react';
import {
  FileText,
  Link2,
  FileCode2,
  Image as ImageIcon,
  Search,
  Upload,
  Sparkles,
  AlertCircle,
  X,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface ScannerProps {
  onInvestigate: (params: {
    inputMode: 'text' | 'url' | 'pdf' | 'image';
    text?: string;
    url?: string;
    fileBase64?: string;
    mimeType?: string;
    fileName?: string;
  }) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
  externalInputText?: string;
  onExternalInputConsumed?: () => void;
}

export const DEMO_PRESETS = [
  {
    id: 'deposit-scam',
    title: '⚠️ Fake Offer + ₹12,500 Deposit (High Risk Demo)',
    badge: 'Urgent Deposit',
    text: `Subject: Official Appointment Letter - Senior Software Engineer
Company: Apex Future Technologies Ltd.
Dear Candidate,

Congratulations! We are thrilled to inform you that following your profile review, you have been directly selected for the position of Senior Software Engineer at Apex Future Technologies with an annual CTC of ₹28,50,000.

To activate your employee corporate portal and secure your company MacBook Pro M3, you are required to submit a mandatory refundable security deposit of ₹12,500 via UPI (apex-onboarding@fakeupi) within the next two (2) hours. Failure to remit this refundable fee before 3:00 PM will result in immediate cancellation of your appointment.

Please reply to this email immediately with your Aadhaar Card number, primary Bank Account Details, and the SMS OTP verification code sent to your registered mobile number for KYC authentication.

Regards,
HR Onboarding Team
Apex Future Technologies`,
  },
  {
    id: 'id-harvester',
    title: '🚨 WhatsApp Recruiter + Aadhaar/PAN Harvesting',
    badge: 'Data Harvester',
    text: `[WhatsApp Message]
Recruiter Priya from "Google Global Talent Partner":
Hi! We reviewed your LinkedIn and found you suitable for Data Entry & Cloud Assistant.
Salary is ₹45,000 per month (work from home 2 hrs/day).
No interview required! We have selected you based on your resume.
Please send your photo, front and back photo of your Aadhaar Card, PAN Card, and cancelled cheque with your bank account number and IFSC code right now to confirm your appointment letter today.`,
  },
  {
    id: 'legitimate-sample',
    title: '✅ Standard Corporate Offer (Normal Hiring Process)',
    badge: 'Legitimate Style',
    text: `From: careers@stripe.com
To: candidate@domain.com
Subject: Stripe Offer of Employment - Software Engineer

Dear Candidate,

Following your final virtual interview panel with our engineering team last week, we are delighted to formally extend this offer of employment for the position of Software Engineer at Stripe.

Please review the attached formal offer letter outlining your compensation breakdown, health benefits, and equity grants. Take your time to review the agreement—we request your response by Friday next week. Stripe will never ask candidates for security deposits, equipment fees, or personal banking credentials during the hiring process.

If you have any questions, please reach out to your recruiter directly or email recruiting-support@stripe.com.

Best regards,
Stripe Talent Acquisition`,
  },
  {
    id: 'unrealistic-salary',
    title: '⚖️ Unrealistic Salary Remote Telegram Gig',
    badge: 'Suspicious Comp',
    text: `Urgent Hiring: International E-Commerce Project Manager
Earn $500 - $1,000 daily by simply rating hotel products online! No technical experience or background check required.
Immediate start today. Contact our supervisor exclusively on Telegram @Global_Work_Manager to receive your first task payout.`,
  },
];

export const Scanner: React.FC<ScannerProps> = ({
  onInvestigate,
  isLoading,
  loadingStep,
  externalInputText,
  onExternalInputConsumed,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'pdf' | 'image'>('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync external text if loaded from Scam Pattern Library
  React.useEffect(() => {
    if (externalInputText) {
      setInputText(externalInputText);
      setActiveTab('text');
      setSelectedFile(null);
      if (onExternalInputConsumed) {
        onExternalInputConsumed();
      }
    }
  }, [externalInputText, onExternalInputConsumed]);

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setFileError(null);
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (activeTab === 'pdf' && !isPdf) {
      setFileError('Please select a valid PDF document.');
      return;
    }
    if (activeTab === 'image' && !isImage) {
      setFileError('Please select a valid image (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit. Please provide a smaller document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setSelectedFile({
        file,
        base64: base64Data,
        mimeType: file.type || (isPdf ? 'application/pdf' : 'image/png'),
      });
    };
    reader.onerror = () => {
      setFileError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (presetText: string) => {
    setActiveTab('text');
    setInputText(presetText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (activeTab === 'text') {
      if (!inputText.trim()) return;
      await onInvestigate({
        inputMode: 'text',
        text: inputText.trim(),
      });
    } else if (activeTab === 'url') {
      if (!inputUrl.trim()) return;
      await onInvestigate({
        inputMode: 'url',
        url: inputUrl.trim(),
      });
    } else {
      if (!selectedFile) return;
      await onInvestigate({
        inputMode: activeTab,
        fileBase64: selectedFile.base64,
        mimeType: selectedFile.mimeType,
        fileName: selectedFile.file.name,
      });
    }
  };

  return (
    <div id="offer-scanner-section" className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Container card */}
      <div className="cyber-card rounded-2xl border border-cyan-500/25 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle top cyber border line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Input Mode Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              id="tab-paste-text"
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'text'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Offer Text</span>
            </button>

            <button
              id="tab-analyze-url"
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'url'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Analyze URL</span>
            </button>

            <button
              id="tab-upload-pdf"
              type="button"
              onClick={() => {
                setActiveTab('pdf');
                setSelectedFile(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'pdf'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>Upload PDF</span>
            </button>

            <button
              id="tab-upload-screenshot"
              type="button"
              onClick={() => {
                setActiveTab('image');
                setSelectedFile(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'image'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Screenshot</span>
            </button>
          </div>

          {/* Try Demo Quick Button */}
          <button
            id="btn-try-demo"
            type="button"
            onClick={() => handleSelectPreset(DEMO_PRESETS[0].text)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/20 text-amber-300 hover:bg-amber-900/30 text-xs font-mono transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Try Demo (Fictional)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text Tab */}
          {activeTab === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="input-offer-text" className="text-xs font-mono text-slate-400">
                  Paste full offer letter, recruiter WhatsApp/Telegram message, or email body:
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {inputText.length} characters
                </span>
              </div>
              <textarea
                id="input-offer-text"
                rows={7}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Example: 'Congratulations! You have been selected for Senior Software Engineer. To activate your account, remit ₹12,500 refundable security deposit within 2 hours...'"
                className="w-full rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 p-3.5 text-sm font-mono leading-relaxed transition-all resize-y"
              />
            </div>
          )}

          {/* URL Tab */}
          {activeTab === 'url' && (
            <div>
              <label htmlFor="input-offer-url" className="block text-xs font-mono text-slate-400 mb-2">
                Job Posting URL or Recruiter Link to analyze:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Link2 className="w-4 h-4" />
                </div>
                <input
                  id="input-offer-url"
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://company-careers-portal-secure.fake/apply/job-id-992"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 text-sm font-mono transition-all"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400 font-mono">
                Inspects domain lookalike traits, suspicious query parameters, and unverified recruitment gateways.
              </p>
            </div>
          )}

          {/* PDF or Screenshot Tab */}
          {(activeTab === 'pdf' || activeTab === 'image') && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={activeTab === 'pdf' ? 'application/pdf' : 'image/*'}
                className="hidden"
                id="file-upload-input"
              />

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-8 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-200 mb-1">
                    Click to browse or drag and drop your {activeTab === 'pdf' ? 'PDF offer letter' : 'conversation screenshot'}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {activeTab === 'pdf' ? 'PDF files up to 10MB' : 'PNG, JPG, WebP screenshots up to 10MB'}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-cyan-500/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      {activeTab === 'pdf' ? <FileCode2 className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                        {selectedFile.file.name}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        {(selectedFile.file.size / 1024).toFixed(1)} KB • {selectedFile.mimeType}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {fileError && (
                <div className="mt-2 text-xs text-rose-400 font-mono flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          )}

          {/* Quick Preset Selector Buttons */}
          <div className="pt-2">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 mb-1.5">
              <span>Quick Test Scenarios:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.text)}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 transition-colors text-left"
                >
                  {preset.badge}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Multi-signal forensic evidence pipeline</span>
            </div>

            <button
              id="btn-investigate"
              type="submit"
              disabled={
                isLoading ||
                (activeTab === 'text' && !inputText.trim()) ||
                (activeTab === 'url' && !inputUrl.trim()) ||
                ((activeTab === 'pdf' || activeTab === 'image') && !selectedFile)
              }
              className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-sm tracking-wider shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>INVESTIGATING...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>🔍 INVESTIGATE</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Real Dynamic Loading Status Progress Bar */}
        {isLoading && (
          <div className="mt-6 pt-4 border-t border-cyan-500/20 bg-slate-900/90 rounded-xl p-4 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                {loadingStep || '🔍 Reading offer...'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">Deterministic Engine Active</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 h-1.5 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
