
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
import { GOV_FORMS } from '../constants.tsx';
import { UserActivity } from '../types.ts';

interface FormAssistantProps {
  form: typeof GOV_FORMS[0];
  onClose: () => void;
  addActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
}

const DUAL_SIDE_DOCS = ['Citizenship Card', 'National ID', 'Identity Card', 'National ID (NID)'];
const MAX_FILE_SIZE_KB = 300;

const FormAssistant: React.FC<FormAssistantProps> = ({ form, onClose, addActivity }) => {
  const [uploads, setUploads] = useState<Record<string, { name: string, size: string } | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<{ docName: string, side?: 'front' | 'back' } | null>(null);

  const RECIPIENT_EMAIL = "domestic-ops@sajilohub.com";

  const requiredKeys = useMemo(() => {
    const keys: string[] = [];
    form.docs.forEach(doc => {
      const isDual = DUAL_SIDE_DOCS.some(d => doc.toLowerCase().includes(d.toLowerCase()));
      if (isDual) keys.push(`${doc}_front`, `${doc}_back`);
      else keys.push(doc);
    });
    return keys;
  }, [form.docs]);

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
      const key = activeSlot.docName;
      setUploads(prev => ({ ...prev, [key]: { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' } }));
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
        details: `${Object.keys(uploads).length} documents submitted for processing.`
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a0f1d]/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold">{form.title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {error && <div className="mb-6 text-red-400 text-xs bg-red-500/10 p-4 rounded-xl">{error}</div>}
          <div className="space-y-6">
            {form.docs.map((doc, idx) => (
              <div key={idx} className={`bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between transition-colors ${uploads[doc] ? 'border-blue-500/40 bg-blue-500/5' : ''}`}>
                <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-xl ${uploads[doc] ? 'bg-blue-500/20 text-blue-500' : 'bg-white/5 text-slate-500'}`}>
                      <FileCheck className="w-5 h-5" />
                   </div>
                   <div>
                      <span className="text-sm font-bold block">{doc}</span>
                      {uploads[doc] && <span className="text-[10px] text-blue-400 font-mono">{uploads[doc]?.name}</span>}
                   </div>
                </div>
                <button 
                  onClick={() => { setActiveSlot({ docName: doc }); fileInputRef.current?.click(); }}
                  className={`${uploads[doc] ? 'bg-white/10' : 'bg-blue-600'} px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95`}
                >
                  {uploads[doc] ? 'Re-Upload' : 'Upload'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        <div className="p-8 bg-white/5 flex flex-col gap-4 border-t border-white/5">
          <button 
            disabled={!allDocsUploaded || isSubmitting} 
            onClick={handleSubmit} 
            className="w-full bg-blue-600 disabled:opacity-30 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-blue-500/20"
          >
            {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Dispatching...</> : <><Send className="w-5 h-5" /> Submit Documents</>}
          </button>
        </div>
      </div>
      {isSuccess && (
         <div className="absolute inset-0 bg-[#0a0f1d] flex flex-col items-center justify-center text-center p-10 z-[70] animate-in zoom-in duration-300">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Identity Dispatched</h3>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest max-w-[280px] leading-relaxed mb-8">
               Your application packets have been securely transmitted to the Sajilo core node. You can track status in your profile.
            </p>
            <button onClick={onClose} className="bg-emerald-600 px-12 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-emerald-500 active:scale-95">Return to Hub</button>
         </div>
      )}
    </div>
  );
};

export default FormAssistant;
