import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Link2,
  FileCode2,
  Image as ImageIcon,
  Search,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react';
import { Button } from './ui/Button';

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
    label: 'Suspicious Offer',
    badge: 'Suspicious Offer',
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
    label: 'Recruiter Message',
    badge: 'Recruiter Message',
    text: `[WhatsApp Message]
Recruiter Priya from "Google Global Talent Partner":
Hi! We reviewed your LinkedIn and found you suitable for Data Entry & Cloud Assistant.
Salary is ₹45,000 per month (work from home 2 hrs/day).
No interview required! We have selected you based on your resume.
Please send your photo, front and back photo of your Aadhaar Card, PAN Card, and cancelled cheque with your bank account number and IFSC code right now to confirm your appointment letter today.`,
  },
  {
    id: 'legitimate-sample',
    label: 'Legitimate Offer',
    badge: 'Legitimate Offer',
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

  useEffect(() => {
    if (externalInputText) {
      setInputText(externalInputText);
      setActiveTab('text');
      setSelectedFile(null);
      if (onExternalInputConsumed) {
        onExternalInputConsumed();
      }
    }
  }, [externalInputText, onExternalInputConsumed]);

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

  const isSubmitDisabled =
    isLoading ||
    (activeTab === 'text' && !inputText.trim()) ||
    (activeTab === 'url' && !inputUrl.trim()) ||
    ((activeTab === 'pdf' || activeTab === 'image') && !selectedFile);

  return (
    <section id="offer-scanner-section" className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* ONE large clean card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            What would you like to investigate?
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Submit text, links, or attachments for automated threat intelligence & forensic analysis.
          </p>
        </div>

        {/* Input tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800/80 mb-6 max-w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'text'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>URL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('pdf');
              setSelectedFile(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'pdf'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCode2 className="w-4 h-4 text-cyan-400" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('image');
              setSelectedFile(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'image'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Screenshot</span>
          </button>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'text' && (
            <div>
              <textarea
                id="input-offer-text"
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste a job offer, recruiter message or email..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 p-4 text-sm font-sans leading-relaxed transition-all resize-y outline-none"
              />
              <div className="flex justify-end mt-1 text-xs text-slate-500">
                {inputText.length > 0 && `${inputText.length} characters`}
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div>
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
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 text-sm transition-all outline-none"
                />
              </div>
            </div>
          )}

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
                  className="border border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-8 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all"
                >
                  <div className="mx-auto w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-3">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-200 mb-1">
                    Click to browse or drag and drop your {activeTab === 'pdf' ? 'PDF file' : 'screenshot image'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {activeTab === 'pdf' ? 'PDF documents up to 10MB' : 'PNG, JPG, WebP up to 10MB'}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                      {activeTab === 'pdf' ? <FileCode2 className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {selectedFile.file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(selectedFile.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {fileError && (
                <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          )}

          {/* Example Options & Primary CTA */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Small example chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">Try example:</span>
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.text)}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Primary CTA: Investigate Offer */}
            <Button
              size="lg"
              variant="primary"
              type="submit"
              disabled={isSubmitDisabled}
              isLoading={isLoading}
              icon={<Search className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Investigate Offer
            </Button>
          </div>
        </form>

        {/* Dynamic Loading Step */}
        {isLoading && (
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-2 text-cyan-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {loadingStep || 'Analyzing offer intelligence...'}
              </span>
              <span>Evaluating signals</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div className="bg-cyan-500 h-1.5 rounded-full animate-pulse w-3/4 transition-all" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
