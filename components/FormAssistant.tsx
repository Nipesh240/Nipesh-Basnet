
import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Paperclip,
  Trash2,
  Send,
  Mail,
  ShieldCheck,
  Image as ImageIcon,
  Info,
  QrCode,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-react';
import { GOV_FORMS } from '../constants';

interface FormAssistantProps {
  form: typeof GOV_FORMS[0];
  onClose: () => void;
}

const DUAL_SIDE_DOCS = ['Citizenship Card', 'National ID', 'Identity Card', 'National ID (NID)'];
const MAX_FILE_SIZE_KB = 300;

const FormAssistant: React.FC<FormAssistantProps> = ({ form, onClose }) => {
  const [uploads, setUploads] = useState<Record<string, { name: string, size: string } | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<{ docName: string, side?: 'front' | 'back' } | null>(null);

  const RECIPIENT_EMAIL = "domestic-ops@sajilohub.com";

  // Calculate required keys including dual-side expansion
  const requiredKeys = useMemo(() => {
    const keys: string[] = [];
    form.docs.forEach(doc => {
      const isDual = DUAL_SIDE_DOCS.some(d => doc.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(doc.toLowerCase()));
      if (isDual) {
        keys.push(`${doc}_front`, `${doc}_back`);
      } else {
        keys.push(doc);
      }
    });
    return keys;
  }, [form.docs]);

  // Identify non-payment keys to unlock payment section
  const nonPaymentKeys = useMemo(() => 
    requiredKeys.filter(key => !key.toLowerCase().includes('payment') && !key.toLowerCase().includes('voucher')), 
  [requiredKeys]);

  const paymentKey = useMemo(() => 
    requiredKeys.find(key => key.toLowerCase().includes('payment') || key.toLowerCase().includes('voucher')), 
  [requiredKeys]);

  const allNonPaymentDocsUploaded = nonPaymentKeys.every(key => !!uploads[key]);
  const completedCount = requiredKeys.filter(key => !!uploads[key]).length;
  const progress = (completedCount / requiredKeys.length) * 100;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    // Fix: Cast e.target to any to access 'files' property on the input element
    const file = (e.target as any).files?.[0];
    
    if (file && activeSlot) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload a clear JPEG or PNG image.");
        setActiveSlot(null);
        return;
      }

      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > MAX_FILE_SIZE_KB) {
        setError(`File too large (${fileSizeKB.toFixed(1)} KB). Each file must be under 300 KB.`);
        setActiveSlot(null);
        return;
      }

      const key = activeSlot.side ? `${activeSlot.docName}_${activeSlot.side}` : activeSlot.docName;
      setUploads(prev => ({
        ...prev,
        [key]: {
          name: file.name,
          size: fileSizeKB.toFixed(1) + ' KB'
        }
      }));
    }
    setActiveSlot(null);
  };

  const removeFile = (key: string) => {
    setUploads(prev => ({ ...prev, [key]: null }));
    setError(null);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#0a0f1d]/95 backdrop-blur-md" onClick={onClose} />
        <div className="relative w-full max-w-md bg-[#111827] border border-emerald-500/30 rounded-[2.5rem] p-10 text-center animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Transmission Successful</h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            All documents and payment confirmation have been securely transmitted to:
            <br />
            <span className="text-emerald-400 font-bold font-mono mt-3 block bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-xs">
              {RECIPIENT_EMAIL}
            </span>
          </p>
          <p className="text-xs text-slate-500 mb-8 italic">
            Reference ID: SJL-{Math.floor(Math.random() * 1000000)}
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#0a0f1d]/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Paperclip className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{form.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Mail className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Delivery to: {RECIPIENT_EMAIL}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Requirements Banner */}
        <div className="bg-blue-500/10 border-b border-blue-500/20 px-8 py-3 flex items-center gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider leading-tight">
            Requirements: JPEG/PNG format • Clear Scans • Max 300 KB per file
          </p>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-xs text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Document Section - Always Visible */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-blue-400">Step 1: Identity Verification</span>
              <span className="text-xs text-slate-500 font-mono">
                {nonPaymentKeys.filter(k => !!uploads[k]).length}/{nonPaymentKeys.length} Files
              </span>
            </div>
            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.4)]`} 
                style={{ width: `${(nonPaymentKeys.filter(k => !!uploads[k]).length / nonPaymentKeys.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-6 mb-12">
            {form.docs.filter(doc => !doc.toLowerCase().includes('payment') && !doc.toLowerCase().includes('voucher')).map((doc, idx) => {
              const isDual = DUAL_SIDE_DOCS.some(d => doc.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(doc.toLowerCase()));
              
              if (isDual) {
                const frontFile = uploads[`${doc}_front`];
                const backFile = uploads[`${doc}_back`];

                return (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-bold text-slate-200">{doc} (Front & Back Required)</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-2xl border transition-all ${frontFile ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/40 border-white/5'}`}>
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Front Side</p>
                        {frontFile ? (
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-emerald-400 font-mono truncate">{frontFile.name}</span>
                            <button onClick={() => removeFile(`${doc}_front`)} className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1 hover:text-red-300">
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        ) : (
                          <button 
                            // Explicit cast to any to call click() safely
                            onClick={() => { setActiveSlot({ docName: doc, side: 'front' }); (fileInputRef.current as any)?.click(); }}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg shadow-blue-500/10"
                          >
                            <Upload className="w-3 h-3" /> Upload
                          </button>
                        )}
                      </div>

                      <div className={`p-4 rounded-2xl border transition-all ${backFile ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/40 border-white/5'}`}>
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Back Side</p>
                        {backFile ? (
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-emerald-400 font-mono truncate">{backFile.name}</span>
                            <button onClick={() => removeFile(`${doc}_back`)} className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1 hover:text-red-300">
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        ) : (
                          <button 
                            // Explicit cast to any to call click() safely
                            onClick={() => { setActiveSlot({ docName: doc, side: 'back' }); (fileInputRef.current as any)?.click(); }}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg shadow-blue-500/10"
                          >
                            <Upload className="w-3 h-3" /> Upload
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              const file = uploads[doc];
              return (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border transition-all ${
                    file 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {file ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className={`text-sm font-bold ${file ? 'text-emerald-400' : 'text-slate-200'}`}>{doc}</p>
                        {file && <p className="text-[10px] text-emerald-500/60 font-mono mt-1">{file.name} ({file.size})</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file ? (
                        <button 
                          onClick={() => removeFile(doc)}
                          className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          // Explicit cast to any to call click() safely
                          onClick={() => { setActiveSlot({ docName: doc }); (fileInputRef.current as any)?.click(); }}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95"
                        >
                          <Upload className="w-4 h-4" /> Upload
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Section - Conditional on Identity Uploads */}
          {paymentKey && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-emerald-400">Step 2: Service Fee Payment</span>
                {!allNonPaymentDocsUploaded && (
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <Lock className="w-3 h-3" /> Upload Identity First
                  </span>
                )}
              </div>

              {allNonPaymentDocsUploaded ? (
                <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                  <div className="p-6 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Secure eSewa Gateway</span>
                  </div>
                  
                  <div className="p-8 flex flex-col md:flex-row items-center gap-10">
                    <div className="bg-white p-4 rounded-3xl shadow-2xl shrink-0 scale-105">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=esewa_payment_nipesh_basnet_9707340249" 
                        alt="eSewa QR Code" 
                        className="w-36 h-36"
                      />
                      <div className="mt-3 text-center">
                         <span className="text-[10px] font-black text-slate-900 bg-emerald-400 px-3 py-1 rounded-full">SCANNED BY ESEWA</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-5">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">Recipient</h5>
                          <p className="text-lg font-bold text-slate-100">Nipesh Basnet</p>
                        </div>
                        <div>
                          <h5 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">eSewa ID</h5>
                          <p className="text-lg font-mono font-bold text-emerald-400">9707340249</p>
                        </div>
                      </div>
                      <div className="bg-black/30 p-4 rounded-2xl border border-emerald-500/20 text-[11px] text-slate-300 leading-relaxed">
                        <p className="mb-2 font-bold text-emerald-500/80">Follow these steps:</p>
                        1. Open eSewa app & Scan the QR code.<br />
                        2. Pay the required form processing fee.<br />
                        3. <span className="text-white font-bold">Screenshot the success screen</span> and upload it below.
                      </div>
                    </div>
                  </div>

                  {/* Upload Voucher Slot inside Payment Section */}
                  <div className="p-6 bg-emerald-500/5 border-t border-emerald-500/10">
                    <div className={`p-5 rounded-2xl border transition-all ${
                      uploads[paymentKey] 
                        ? 'bg-emerald-500/10 border-emerald-500/40' 
                        : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                    }`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {uploads[paymentKey] ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <QrCode className="w-5 h-5 text-emerald-500 animate-pulse" />
                          )}
                          <div>
                            <p className={`text-sm font-bold ${uploads[paymentKey] ? 'text-emerald-400' : 'text-slate-200'}`}>Payment Voucher Screenshot</p>
                            {uploads[paymentKey] && <p className="text-[10px] text-emerald-500/60 font-mono mt-1">{uploads[paymentKey]!.name} ({uploads[paymentKey]!.size})</p>}
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (uploads[paymentKey]) {
                              removeFile(paymentKey);
                            } else {
                              setActiveSlot({ docName: paymentKey });
                              // Explicit cast to any to call click() safely
                              (fileInputRef.current as any)?.click();
                            }
                          }}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
                            uploads[paymentKey] 
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                          }`}
                        >
                          {uploads[paymentKey] ? <Trash2 className="w-4 h-4" /> : <><Upload className="w-4 h-4" /> Upload Voucher</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-10 border border-dashed border-white/10 rounded-[2.5rem] bg-white/2 flex flex-col items-center justify-center text-center opacity-50 grayscale pointer-events-none">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4 text-slate-500">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h5 className="font-bold text-slate-400 mb-2">Step 2: Locked</h5>
                  <p className="text-xs text-slate-600 max-w-xs">Complete identity document uploads in Step 1 to unlock the payment system and final voucher submission.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-white/5 border-t border-white/5 flex flex-col gap-5">
          <div className="flex items-center justify-center gap-2.5 text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">
            <Mail className="w-3.5 h-3.5" /> Direct transmission to: {RECIPIENT_EMAIL}
          </div>
          <button 
            disabled={completedCount < requiredKeys.length || isSubmitting}
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] py-4"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Verifying All Files...</>
            ) : (
              <><Send className="w-5 h-5" /> Submit Documentation</>
            )}
          </button>
        </div>

        {/* Hidden Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/jpeg,image/png"
        />
      </div>
    </div>
  );
};

export default FormAssistant;