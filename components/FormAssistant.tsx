
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

  const allNonPaymentDocsUploaded = requiredKeys
    .filter(k => !k.toLowerCase().includes('payment'))
    .every(key => !!uploads[key]);

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
      const key = activeSlot.side ? `${activeSlot.docName}_${activeSlot.side}` : activeSlot.docName;
      setUploads(prev => ({ ...prev, [key]: { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' } }));
    }
  };

  const removeFile = (key: string) => setUploads(prev => ({ ...prev, [key]: null }));

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
              <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                <span className="text-sm font-bold">{doc}</span>
                <button 
                  onClick={() => { setActiveSlot({ docName: doc }); fileInputRef.current?.click(); }}
                  className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  {uploads[doc] ? 'Change' : 'Upload'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        <div className="p-8 bg-white/5 flex flex-col gap-4">
          <button disabled={Object.keys(uploads).length === 0} onClick={() => setIsSuccess(true)} className="w-full bg-blue-600 py-4 rounded-2xl font-bold">
            Submit Documents
          </button>
        </div>
      </div>
      {isSuccess && (
         <div className="absolute inset-0 bg-[#0a0f1d] flex flex-col items-center justify-center text-center p-10 z-[70]">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Files Dispatched</h3>
            <button onClick={onClose} className="bg-emerald-600 px-10 py-4 rounded-xl font-bold">Return</button>
         </div>
      )}
    </div>
  );
};

export default FormAssistant;
