
import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  FileCheck, 
  CheckCircle2, 
  Loader2, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  FileText,
  Upload,
  Trash2,
  Lock
} from 'lucide-react';
// Fix: Added missing getIcon import from constants.tsx
import { GOV_FORMS, getIcon } from '../constants.tsx';
import { UserActivity } from '../types.ts';

interface FormAssistantProps {
  form: typeof GOV_FORMS[0];
  onClose: () => void;
  addActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
}

const MAX_FILE_SIZE_KB = 300;

const FormAssistant: React.FC<FormAssistantProps> = ({ form, onClose, addActivity }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Requirements, 2: Uploads, 3: Submission
  const [uploads, setUploads] = useState<Record<string, { name: string, size: string } | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const allDocsUploaded = useMemo(() => {
    return form.docs.every(doc => !!uploads[doc]);
  }, [form.docs, uploads]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && activeSlot) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError("Invalid file type. Use JPEG or PNG.");
        return;
      }
      if (file.size / 1024 > MAX_FILE_SIZE_KB) {
        setError("File must be under 300 KB.");
        return;
      }
      setUploads(prev => ({ ...prev, [activeSlot]: { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' } }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      addActivity({
        type: 'gov_form',
        title: form.title,
        status: 'dispatched',
        details: `${Object.keys(uploads).length} documents submitted.`
      });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[150] bg-[#03040a] flex flex-col items-center justify-center text-center p-10 animate-in zoom-in duration-300">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="w-24 h-24 bg-blue-500/20 rounded-[3rem] flex items-center justify-center mb-8 border border-white/40 shadow-[0_0_50px_rgba(56,189,248,0.3)]">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-3xl font-black uppercase text-white tracking-tight leading-none mb-4">Identity Dispatched</h3>
        <p className="text-[12px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed max-w-sm mb-12">
          Your documentation has been securely transmitted to the Sajilo domestic node. Profile updated.
        </p>
        <button onClick={onClose} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] active:scale-95 transition-all">
          Exit Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#03040a]/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0a0f1d] border border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-white/5 shadow-inner">
               {/* getIcon is now available after import fix */}
               {getIcon(form.icon, "w-6 h-6")}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Step {step} of 3</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{form.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-full hover:bg-white/5 text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-10 max-h-[55vh] overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] space-y-6">
                 <div className="flex items-center gap-4 text-blue-400">
                   <Info className="w-6 h-6 shrink-0" />
                   <h4 className="text-sm font-black uppercase tracking-widest">Protocol Requirements</h4>
                 </div>
                 <p className="text-[12px] text-slate-400 leading-relaxed uppercase tracking-wide">
                   To initiate the {form.title} process, you must provide clear digital copies of the following documents. Ensure images are under 300KB and in JPG/PNG format.
                 </p>
               </div>
               <div className="space-y-4">
                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">Document Checklist</h5>
                 {form.docs.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 bg-white/2 border border-white/5 rounded-2xl">
                       <FileText className="w-5 h-5 text-blue-500/40" />
                       <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{doc}</span>
                    </div>
                 ))}
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 text-center">{error}</div>}
              <div className="grid grid-cols-1 gap-4">
                {form.docs.map((doc, idx) => (
                  <div key={idx} className={`p-6 bg-white/2 border rounded-[1.8rem] flex items-center justify-between transition-all ${uploads[doc] ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/5'}`}>
                    <div className="flex items-center gap-5">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${uploads[doc] ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-700'}`}>
                          <Upload className="w-5 h-5" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-white uppercase tracking-tight">{doc}</span>
                          {uploads[doc] && <span className="text-[8px] font-mono text-blue-400/60 uppercase">{uploads[doc]?.name}</span>}
                       </div>
                    </div>
                    <button 
                      onClick={() => { setActiveSlot(doc); fileInputRef.current?.click(); }}
                      className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${uploads[doc] ? 'bg-white/5 text-slate-500' : 'bg-blue-600 text-white shadow-xl'}`}
                    >
                      {uploads[doc] ? 'Replace' : 'Upload'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 py-6 text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                 <ShieldCheck className="w-10 h-10 text-blue-500" />
              </div>
              <div className="space-y-4">
                 <h4 className="text-2xl font-black uppercase text-white tracking-tighter">Ready for Dispatch</h4>
                 <p className="text-[12px] text-slate-500 uppercase tracking-widest leading-relaxed px-10">
                    Your {Object.keys(uploads).length} document packets are encrypted and ready for synchronized transmission.
                 </p>
              </div>
              <div className="p-6 bg-white/2 border border-white/5 rounded-3xl text-left flex items-center gap-4">
                 <Lock className="w-5 h-5 text-blue-500/40" />
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Security Standard: AES-256 Synchronized Uplink</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-10 border-t border-white/5 bg-white/2 flex gap-4">
           {step > 1 && (
             <button 
              onClick={() => setStep(prev => (prev - 1) as any)}
              className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-2 active:scale-95 transition-all"
             >
               <ChevronLeft className="w-4 h-4" /> Go Back
             </button>
           )}
           
           <button 
            disabled={isSubmitting || (step === 2 && !allDocsUploaded)}
            onClick={() => {
              if (step < 3) setStep(prev => (prev + 1) as any);
              else handleSubmit();
            }}
            className={`flex-[2] py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${
              step === 3 ? 'bg-blue-600 shadow-blue-500/30 text-white' : 'bg-white text-black'
            } disabled:opacity-30`}
           >
             {isSubmitting ? (
               <><Loader2 className="w-4 h-4 animate-spin" /> Dispatching...</>
             ) : (
               <>
                 {step === 3 ? 'Finalize Dispatch' : 'Continue'}
                 {step < 3 && <ChevronRight className="w-4 h-4" />}
                 {step === 3 && <Send className="w-4 h-4" />}
               </>
             )}
           </button>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default FormAssistant;
