import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Shield, 
  User, 
  Mail, 
  Key, 
  Loader2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Activity,
  Terminal,
  Cpu,
  Fingerprint,
  ShieldCheck,
  Smartphone,
  Lock,
  UserPlus,
  LogIn,
  AlertCircle,
  // Added missing CheckCircle2 import
  CheckCircle2
} from 'lucide-react';
import { Logo } from '../constants.tsx';

interface StartupGateProps {
  onUnlock: (userData: any) => void;
}

interface UserRecord {
  name: string;
  email: string;
  password: string;
}

const StartupGate: React.FC<StartupGateProps> = ({ onUnlock }) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [regStep, setRegStep] = useState<'details' | 'verify' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock User Database in LocalStorage
  const getUsers = (): UserRecord[] => {
    const data = localStorage.getItem('sjl_user_db');
    return data ? JSON.parse(data) : [];
  };

  const saveUser = (user: UserRecord) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('sjl_user_db', JSON.stringify(users));
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Artificial Latency
    setTimeout(() => {
      const users = getUsers();

      if (mode === 'login') {
        const existingUser = users.find(u => u.email === formData.email && u.password === formData.password);
        if (existingUser) {
          onUnlock({ name: existingUser.name, email: existingUser.email });
        } else {
          const emailExists = users.some(u => u.email === formData.email);
          if (!emailExists) {
            setError("IDENTITY_NOT_FOUND: Please create an account first.");
          } else {
            setError("AUTH_FAILURE: Security key mismatch.");
          }
        }
        setIsLoading(false);
      } else {
        // Registering
        if (!formData.email.endsWith('@gmail.com')) {
          setError("PROTOCOL_ERROR: Valid Gmail required for verification.");
          setIsLoading(false);
          return;
        }
        const alreadyExists = users.some(u => u.email === formData.email);
        if (alreadyExists) {
          setError("CONFLICT: Identity already enrolled. Please login.");
          setIsLoading(false);
          return;
        }
        
        // Advance to verification
        setRegStep('verify');
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyAndCreateAccount = () => {
    if (otp.some(o => o === '')) {
      setError("Please input the 6-digit verification code.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      saveUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setIsLoading(false);
      setRegStep('success');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-[#03040a] flex items-center justify-center p-6 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 grid-bg opacity-[0.05] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)]" />
      
      <div className="relative w-full max-w-lg flex flex-col items-center gap-10 animate-in fade-in duration-1000">
        
        {/* Central Rotating Logo */}
        <div className="relative flex flex-col items-center group">
          <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" />
          
          <div className="relative z-10 w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-ping opacity-20" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/5 animate-spin-slow-ccw" />
            
            <div className="animate-rotate-slow">
              <Logo className="w-28 h-28 md:w-36 md:h-36 text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
            </div>
          </div>

          <div className="mt-6 space-y-1 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Sajilo Hub</h1>
            <p className="text-[9px] font-black uppercase text-blue-500 tracking-[0.5em]">Identity Gateway</p>
          </div>
        </div>

        {/* Auth Interaction Panel */}
        <div className="w-full glass-card rounded-[3rem] p-8 md:p-10 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">
          
          {regStep === 'details' && (
            <>
              <div className="flex items-center gap-10 mb-8 justify-center">
                <button 
                  onClick={() => { setMode('register'); setError(null); }}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${mode === 'register' ? 'text-white' : 'text-slate-600'}`}
                >
                  <UserPlus className="w-3 h-3 inline mr-2 mb-0.5" /> Sign Up
                  {mode === 'register' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] rounded-full" />}
                </button>
                <button 
                  onClick={() => { setMode('login'); setError(null); }}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${mode === 'login' ? 'text-white' : 'text-slate-600'}`}
                >
                  <LogIn className="w-3 h-3 inline mr-2 mb-0.5" /> Login
                  {mode === 'login' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] rounded-full" />}
                </button>
              </div>

              <form onSubmit={handleAction} className="space-y-5">
                {error && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-red-400">{error}</span>
                   </div>
                )}

                <div className="space-y-4">
                  {mode === 'register' && (
                    <div className="relative group animate-in slide-in-from-left-4 duration-300">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4.5 text-sm font-bold focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700 text-white" 
                        placeholder="FULL NAME" 
                      />
                    </div>
                  )}

                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      required 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4.5 text-sm font-mono focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700 text-white" 
                      placeholder="GMAIL ADDRESS" 
                    />
                  </div>

                  <div className="relative group">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      required 
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-4.5 text-sm font-mono focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700 text-white" 
                      placeholder="PASSWORD" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/40 active:scale-95 disabled:opacity-50 mt-2 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  ) : (
                    <><Zap className="w-4 h-4 fill-current relative z-10" /> <span className="relative z-10">{mode === 'login' ? 'Proceed to Hub' : 'Verify Identity'}</span></>
                  )}
                </button>
              </form>
            </>
          )}

          {regStep === 'verify' && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Email Synchronization</h3>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                    OTP Dispatched To:<br />
                    <span className="text-blue-500 font-mono font-bold">{formData.email}</span>
                  </p>
               </div>

               {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                    <Lock className="w-4 h-4 text-red-500" />
                    <span className="text-[9px] font-black uppercase text-red-400">{error}</span>
                  </div>
               )}

               <div className="flex justify-between gap-2 px-2">
                 {otp.map((digit, idx) => (
                   <input
                     key={idx}
                     id={`otp-input-${idx}`}
                     type="text"
                     value={digit}
                     onChange={(e) => handleOtpChange(idx, e.target.value)}
                     className="w-10 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-lg font-bold font-mono text-white focus:border-blue-500 outline-none transition-all"
                     maxLength={1}
                   />
                 ))}
               </div>

               <div className="space-y-4">
                 <button 
                   onClick={verifyAndCreateAccount}
                   disabled={isLoading}
                   className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-emerald-500 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                 >
                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Finalize Link</>}
                 </button>
                 <button 
                  onClick={() => setRegStep('details')}
                  className="w-full text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-white transition-colors"
                 >
                  Back To Details
                 </button>
               </div>
            </div>
          )}

          {regStep === 'success' && (
            <div className="space-y-8 animate-in zoom-in duration-500 text-center py-6">
               <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase text-white tracking-tight">Account Created</h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
                    Identity synchronized with domestic nodes.<br />You can now proceed to login.
                  </p>
               </div>
               <button 
                onClick={() => {
                  setMode('login');
                  setRegStep('details');
                  setError(null);
                }}
                className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                Go To Login <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-4 opacity-30">
             <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-blue-500" />
                <span className="text-[7px] font-black uppercase tracking-[0.1em]">AES-256</span>
             </div>
             <div className="w-[1px] h-3 bg-white/20" />
             <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span className="text-[7px] font-black uppercase tracking-[0.1em]">SYNC_READY</span>
             </div>
          </div>
        </div>

        <p className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.3em] text-center max-w-[280px] leading-relaxed">
          Authorized domestic access only. All sessions are subject to hub-node audits.
        </p>
      </div>

      <style>{`
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-slow-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-rotate-slow {
          animation: rotate-slow 15s linear infinite;
        }
        .animate-spin-slow-ccw {
          animation: rotate-slow-ccw 25s linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.15s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default StartupGate;
