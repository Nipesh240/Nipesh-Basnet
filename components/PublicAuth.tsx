
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  User, 
  Key, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  Info,
  Zap,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { Logo } from '../constants.tsx';

interface PublicAuthProps {
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

const PublicAuth: React.FC<PublicAuthProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'details' | 'verify' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.endsWith('@gmail.com')) {
      setError("Please provide a real Gmail address (e.g., example@gmail.com).");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.some(o => o === '')) {
      setError("Please enter the 6-digit code dispatched to your Gmail.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      // Save to local User DB for Admin
      const rawUsers = localStorage.getItem('sjl_user_db');
      const users = rawUsers ? JSON.parse(rawUsers) : [];
      const newUser = {
        name: formData.name,
        email: formData.email,
        joinedAt: new Date().toISOString()
      };
      
      if (!users.some((u: any) => u.email === newUser.email)) {
        users.push(newUser);
        localStorage.setItem('sjl_user_db', JSON.stringify(users));
      }

      setIsLoading(false);
      setStep('success');
    }, 2000);
  };

  const handleFinalize = () => {
    onSuccess({
      name: formData.name,
      email: formData.email,
      verified: true,
      tier: 1,
      joinedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#03040a]/98 backdrop-blur-3xl flex items-center justify-center p-6 overflow-hidden animate-in fade-in duration-500">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />

      <div className="relative w-full max-w-lg">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20">
            <Logo className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="font-heading text-4xl font-black uppercase text-white tracking-tighter">PORTAL JOIN</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500 mt-2 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Domestic Citizen Infrastructure
          </p>
        </div>

        <div className="glass-card rounded-[3rem] p-10 md:p-14 border-white/5 shadow-2xl relative overflow-hidden">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] flex items-center gap-2">
                    <User className="w-3 h-3" /> Full_Name
                  </label>
                  <input 
                    required 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-sm font-bold focus:border-blue-500 outline-none transition-all placeholder:text-slate-800 text-white" 
                    placeholder="ENTER_YOUR_NAME" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Real_Gmail_Address
                  </label>
                  <input 
                    required 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-sm font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-800 text-white" 
                    placeholder="IDENTITY@GMAIL.COM" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] flex items-center gap-2">
                    <Key className="w-3 h-3" /> Security_Key
                  </label>
                  <div className="relative">
                    <input 
                      required 
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-sm font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-800 text-white" 
                      placeholder="••••••••••••" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest text-center bg-red-500/10 p-4 rounded-2xl">{error}</p>}

              <button disabled={isLoading} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-2xl active:scale-95 disabled:opacity-50">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-4 h-4" /> DISPATCH_VERIFICATION</>}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-emerald-500 animate-bounce" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Gmail Verification</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed"> synchronization code dispatched to: <span className="text-white font-mono font-bold">{formData.email}</span></p>
              </div>
              <div className="flex justify-center gap-2 sm:gap-4">
                {otp.map((digit, idx) => (
                  <input key={idx} id={`otp-${idx}`} type="text" value={digit} onChange={(e) => handleOtpChange(idx, e.target.value)} className="w-10 h-14 sm:w-12 sm:h-16 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-mono font-bold text-white focus:border-blue-500 outline-none transition-all" maxLength={1} />
                ))}
              </div>
              <button onClick={handleVerify} disabled={isLoading} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-2xl active:scale-95 disabled:opacity-50">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> VERIFY_GMAIL</>}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-10 animate-in zoom-in duration-500 text-center py-10">
               <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                  <ShieldCheck className="w-12 h-12 text-emerald-500" />
               </div>
               <span className="text-xl font-black uppercase tracking-[0.6em] text-emerald-400 block">IDENTITY SYNCED</span>
               <button onClick={handleFinalize} className="w-full bg-white text-black py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl">
                Enter Strategic Hub <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicAuth;
