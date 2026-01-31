
import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Gamepad2, 
  ChevronRight, 
  CheckCircle2, 
  QrCode, 
  Send, 
  Loader2, 
  Trash2, 
  Upload, 
  Lock, 
  AlertCircle,
  Mail,
  Zap
} from 'lucide-react';
import { GAME_LIST, getIcon } from '../constants';

interface GameTopupAssistantProps {
  onClose: () => void;
}

const MAX_FILE_SIZE_KB = 300;
const RECIPIENT_EMAIL = "domestic-ops@sajilohub.com";

const GameTopupAssistant: React.FC<GameTopupAssistantProps> = ({ onClose }) => {
  const [selectedGame, setSelectedGame] = useState<typeof GAME_LIST[0] | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [voucher, setVoucher] = useState<{ name: string, size: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormComplete = useMemo(() => {
    if (!selectedGame) return false;
    return selectedGame.requirements.every(req => !!formData[req] && formData[req].length >= 2);
  }, [selectedGame, formData]);

  const handleInputChange = (req: string, val: string) => {
    setFormData(prev => ({ ...prev, [req]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    // Fix: Cast e.target to any to access 'files' property of the input element
    const file = (e.target as any).files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError("Invalid format. Please upload a clear JPEG or PNG payment screenshot.");
        return;
      }
      if (file.size / 1024 > MAX_FILE_SIZE_KB) {
        setError(`File too large. Max 300KB allowed for transmission.`);
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
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#0a0f1d]/95 backdrop-blur-md" onClick={onClose} />
        <div className="relative w-full max-w-md bg-[#111827] border border-purple-500/30 rounded-[2.5rem] p-10 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Topup Dispatched</h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Your topup for <span className="text-white font-bold">{selectedGame?.name}</span> is being processed. Typical delivery time: 5-15 mins.
          </p>
          <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 mb-8">
             <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">Queue ID: SJL-GAM-{Math.floor(Math.random() * 100000)}</p>
             <p className="text-xs font-mono text-white truncate px-4">{RECIPIENT_EMAIL}</p>
          </div>
          <button onClick={onClose} className="w-full bg-purple-600 py-4 rounded-xl font-bold hover:bg-purple-500 transition-colors">Close Portal</button>
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
            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Game Topup Hub</h3>
              <p className="text-[10px] text-purple-400 uppercase font-bold tracking-widest mt-0.5">Direct National Topup Service</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {!selectedGame ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Your Game</h4>
                <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-1 rounded">Fast & Secure</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GAME_LIST.map(game => (
                  <button 
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                        {getIcon(game.icon, "w-5 h-5")}
                      </div>
                      <span className="font-bold text-slate-200 group-hover:text-white">{game.name}</span>
                    </div>
                    <Zap className="w-4 h-4 text-slate-600 group-hover:text-purple-500 transition-transform group-hover:scale-125" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <button onClick={() => setSelectedGame(null)} className="text-[10px] font-bold text-slate-500 uppercase hover:text-white transition-colors">← Other Games</button>
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Active Game:</span>
                     <span className="text-sm font-bold text-white">{selectedGame.name}</span>
                   </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-400 font-medium">{error}</p>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                  {selectedGame.requirements.map(req => (
                    <div key={req}>
                      <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 block">{req}</label>
                      {/* Fix: Cast e.target to any to access 'value' property of input */}
                      <input 
                        type="text" 
                        value={formData[req] || ''}
                        onChange={(e) => handleInputChange(req, (e.target as any).value)}
                        placeholder={`Enter ${req}`}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-700 text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Verification Step */}
              <div className={`space-y-6 transition-all duration-500 ${!isFormComplete ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
                 <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                       {!isFormComplete && <Lock className="w-4 h-4" />} Payment Step
                    </h4>
                    {!isFormComplete && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enter Player Details First</span>}
                 </div>

                 <div className="bg-purple-500/5 border border-purple-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=esewa_payment_nipesh_basnet_9707340249" 
                        alt="eSewa QR" 
                        className="w-32 h-32"
                      />
                      <div className="mt-2 text-center text-[8px] font-black text-slate-900 bg-purple-400 rounded-full py-0.5 uppercase">Scan via eSewa</div>
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                       <div>
                         <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Pay To: Nipesh Basnet</p>
                         <p className="text-xl font-mono font-bold text-purple-400">9707340249</p>
                       </div>
                       <p className="text-[11px] text-slate-400 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                         Scan the QR or use the ID. After payment, upload the <span className="text-white font-bold">Transaction Success Screenshot</span> below.
                       </p>
                    </div>
                 </div>

                 {/* Upload Voucher Slot */}
                 <div className={`p-6 rounded-3xl border transition-all ${voucher ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center justify-between gap-4">
                       <div className="flex items-center gap-4">
                          {voucher ? (
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                          ) : (
                            <QrCode className="w-10 h-10 text-purple-500/40" />
                          )}
                          <div>
                             <p className="text-sm font-bold text-slate-200">Transaction Screenshot</p>
                             {voucher && <p className="text-[10px] text-emerald-500/60 font-mono mt-0.5">{voucher.name} ({voucher.size})</p>}
                          </div>
                       </div>
                       <button 
                         onClick={() => {
                           if (voucher) setVoucher(null);
                           // Explicit cast to any to call click() safely
                           else (fileInputRef.current as any)?.click();
                         }}
                         className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
                            voucher 
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                          }`}
                       >
                          {voucher ? <Trash2 className="w-4 h-4" /> : <><Upload className="w-4 h-4" /> Upload Proof</>}
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-white/5 border-t border-white/5">
           <div className="flex items-center justify-center gap-2.5 text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center mb-6">
            <Mail className="w-3.5 h-3.5" /> Dispatched to: {RECIPIENT_EMAIL}
          </div>
          <button 
            disabled={!voucher || !isFormComplete || isSubmitting}
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-2xl shadow-purple-500/20 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting Request...</>
            ) : (
              <><Zap className="w-5 h-5" /> Confirm Game Topup</>
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

export default GameTopupAssistant;