
import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Wifi, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2, 
  QrCode, 
  Smartphone, 
  Send, 
  Loader2, 
  Trash2, 
  Upload, 
  Lock, 
  AlertCircle,
  Mail,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { WIFI_ISPS, getIcon } from '../constants.tsx';
import { UserActivity } from '../types.ts';

interface WifiTopupAssistantProps {
  onClose: () => void;
  addActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
}

const MAX_FILE_SIZE_KB = 300;
const RECIPIENT_EMAIL = "domestic-ops@sajilohub.com";

const WifiTopupAssistant: React.FC<WifiTopupAssistantProps> = ({ onClose, addActivity }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Select ISP, 2: Details, 3: Payment
  const [selectedISP, setSelectedISP] = useState<typeof WIFI_ISPS[0] | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [voucher, setVoucher] = useState<{ name: string, size: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormComplete = useMemo(() => {
    if (!selectedISP) return false;
    return selectedISP.requirements.every(req => !!formData[req] && formData[req].length >= 2);
  }, [selectedISP, formData]);

  const handleInputChange = (req: string, val: string) => {
    setFormData(prev => ({ ...prev, [req]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = (e.target as any).files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError("Invalid file type. Please upload a clear JPEG or PNG.");
        return;
      }
      if (file.size / 1024 > MAX_FILE_SIZE_KB) {
        setError(`File must be under 300KB.`);
        return;
      }
      setVoucher({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      addActivity({
        type: 'wifi',
        title: `${selectedISP?.name} Recharge`,
        status: 'dispatched',
        details: `Customer ID: ${formData[selectedISP?.requirements[0] || '']}`
      });
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#03040a]/95 backdrop-blur-xl" onClick={onClose} />
        <div className="relative w-full max-w-md bg-[#0a0f1d] border border-emerald-500/20 rounded-[3rem] p-12 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Request Sent</h3>
          <p className="text-slate-500 text-[11px] uppercase tracking-[0.2em] mb-10 leading-relaxed">
            Your topup for <span className="text-white font-black">{selectedISP?.name}</span> is being processed by our domestic node. Typical activation time: 2-5 minutes.
          </p>
          <button onClick={onClose} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] active:scale-95 transition-all">Exit Module</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#03040a]/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0a0f1d] border border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-white/5 shadow-inner">
              <Wifi className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Step {step} of 3</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Wifi Topup</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-full hover:bg-white/5 text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-10 max-h-[55vh] overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WIFI_ISPS.map(isp => (
                  <button 
                    key={isp.id}
                    onClick={() => { setSelectedISP(isp); setStep(2); }}
                    className={`flex items-center justify-between p-6 rounded-3xl transition-all group shadow-lg border ${
                       selectedISP?.id === isp.id ? 'border-emerald-500/40 bg-emerald-500/5' : 'bg-white/2 border-white/5 hover:border-emerald-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 transition-colors">
                        {getIcon(isp.icon, "w-5 h-5")}
                      </div>
                      <span className="font-bold text-slate-200 group-hover:text-white uppercase text-xs tracking-widest">{isp.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && selectedISP && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase text-red-400 text-center">{error}</div>}
              <div className="p-8 bg-white/2 border border-white/5 rounded-[2.5rem] space-y-8">
                <div className="flex items-center gap-4 text-emerald-400 border-b border-white/5 pb-6">
                   <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                     {getIcon(selectedISP.icon, "w-5 h-5")}
                   </div>
                   <h4 className="text-lg font-black uppercase tracking-tight text-white">{selectedISP.name} Node</h4>
                </div>
                {selectedISP.requirements.map(req => (
                  <div key={req}>
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3 block px-1">{req}</label>
                    <input 
                      type="text" 
                      value={formData[req] || ''}
                      onChange={(e) => handleInputChange(req, e.target.value)}
                      placeholder={`ENTER_${req.toUpperCase().replace(/\s/g, '_')}`}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm font-mono focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-800 text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=esewa_payment_nipesh_basnet_9707340249" 
                    alt="eSewa" 
                    className="w-32 h-32"
                  />
                  <div className="mt-2 text-center text-[8px] font-black text-slate-900 bg-emerald-400 rounded-full py-0.5">ESEWA_NODE_KTM</div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Domestic Gateway: Nipesh Basnet</p>
                    <p className="text-2xl font-mono font-bold text-emerald-400 tracking-tighter">9707340249</p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-wide">
                    Pay using the QR or Mobile ID. Then upload the <span className="text-white font-black">Transfer Receipt</span> below.
                  </p>
                </div>
              </div>

              <div className={`p-8 rounded-[2rem] border transition-all ${voucher ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/2 border-white/10'}`}>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${voucher ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-700'}`}>
                      {voucher ? <CheckCircle2 className="w-6 h-6" /> : <QrCode className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-white tracking-widest">Payment Proof</p>
                      {voucher && <p className="text-[9px] text-emerald-500/60 font-mono mt-1">{voucher.name}</p>}
                    </div>
                  </div>
                  <button 
                    onClick={() => { if (voucher) setVoucher(null); else fileInputRef.current?.click(); }}
                    className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                       voucher ? 'bg-white/5 text-slate-500' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'
                    }`}
                  >
                    {voucher ? 'Replace' : 'Upload Screenshot'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="p-10 border-t border-white/5 bg-white/2 flex gap-4">
           {step > 1 && (
             <button 
              onClick={() => setStep(prev => (prev - 1) as any)}
              className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-2 active:scale-95"
             >
               <ChevronLeft className="w-4 h-4" /> Go Back
             </button>
           )}
           
           <button 
            disabled={isSubmitting || (step === 1 && !selectedISP) || (step === 2 && !isFormComplete) || (step === 3 && !voucher)}
            onClick={() => {
              if (step < 3) setStep(prev => (prev + 1) as any);
              else handleSubmit();
            }}
            className={`flex-[2] py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${
              step === 3 ? 'bg-emerald-600 shadow-emerald-500/30 text-white' : 'bg-white text-black'
            } disabled:opacity-30`}
           >
             {isSubmitting ? (
               <><Loader2 className="w-4 h-4 animate-spin" /> Synchronizing...</>
             ) : (
               <>
                 {step === 3 ? 'Finalize Topup' : 'Continue'}
                 {step < 3 && <ChevronRight className="w-4 h-4" />}
                 {step === 3 && <Send className="w-4 h-4" />}
               </>
             )}
           </button>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default WifiTopupAssistant;
