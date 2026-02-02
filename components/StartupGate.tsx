
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
  CheckCircle2,
  Sparkles,
  ChevronRight
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

    setTimeout(() => {
      const users = getUsers();

      if (mode === 'login') {
        const existingUser = users.find(u => u.email === formData.email && u.password === formData.password);
        if (existingUser) {
          onUnlock({ name: existingUser.name, email: existingUser.email });
        } else {
          setError("Auth Failure: Identity not found or key invalid.");
        }
        setIsLoading(false);
      } else {
        if (!formData.email.endsWith('@gmail.com')) {
          setError("Authorized Gmail node required.");
          setIsLoading(false);
          return;
        }
        const alreadyExists = users.some(u => u.email === formData.email);
        if (alreadyExists) {
          setError("Identity already exists in domestic hub.");
          setIsLoading(false);
          return;
        }
        setRegStep('verify');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-mobile-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyAndCreateAccount = () => {
    if (otp.some(o => o === '')) {
      setError("Enter 6-digit synchronization code.");
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
    <div className="fixed inset-0 z-[500] bg-[#03040a] flex items-center justify-center p-6 overflow-hidden font-sans h-[100dvh]">
      {/* High-Fidelity Ethereal Background */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[160%] h-[50%] bg-sky-500/15 blur-[120px] rounded-full animate-pulse" />
      
      <div className="relative w-full max-w-sm flex flex-col items-center gap-8 animate-in fade-in duration-1000">
        
        {/* Classy Hub Branding */}
        <div className="flex flex-col items-center group">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-sky-400/20 animate-ping opacity-30" />
            <div className="absolute inset-[-12px] rounded-full border border-white/10 animate-spin-slow-ccw" />
            <div className="relative z-10 p-7 bg-sky-400/10 backdrop-blur-3xl rounded-full border border-white/40 shadow-[0_0_60px_rgba(56,189,248,0.25)]">
               <Logo className="w-16 h-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-sm leading-none">Sajilo Hub</h1>
            <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.5em] mt-2 opacity-80">Domestic Portal</p>
          </div>
        </div>

        {/* Ethereal Form Container - Light Blue Blurry with White Border */}
        <div className="w-full bg-sky-400/15 backdrop-blur-[60px] rounded-[3.5rem] p-9 border border-white/50 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          
          {regStep === 'details' && (
            <>
              {/* Classy Switcher */}
              <div className="flex items-center gap-10 mb-8 justify-center border-b border-white/20">
                <button 
                  onClick={() => { setMode('register'); setError(null); }}
                  className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all relative py-5 ${mode === 'register' ? 'text-white' : 'text-white/40'}`}
                >
                  Join
                  {mode === 'register' && <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white rounded-full shadow-[0_0_20px_white]" />}
                </button>
                <button 
                  onClick={() => { setMode('login'); setError(null); }}
                  className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all relative py-5 ${mode === 'login' ? 'text-white' : 'text-white/40'}`}
                >
                  Uplink
                  {mode === 'login' && <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white rounded-full shadow-[0_0_20px_white]" />}
                </button>
              </div>

              <form onSubmit={handleAction} className="space-y-4">
                {error && (
                   <div className="p-4 bg-red-500/20 border border-white/30 rounded-[1.5rem] flex items-center gap-3 animate-in shake duration-300">
                      <AlertCircle className="w-4 h-4 text-white shrink-0" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white leading-tight">{error}</span>
                   </div>
                )}

                <div className="space-y-3">
                  {mode === 'register' && (
                    <div className="relative">
                      <input 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/10 border border-white/40 rounded-[1.5rem] px-7 py-5 text-sm font-bold focus:bg-white/20 focus:border-white outline-none transition-all placeholder:text-white/30 text-white shadow-inner" 
                        placeholder="FULL NAME" 
                      />
                    </div>
                  )}

                  <div className="relative">
                    <input 
                      required 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/10 border border-white/40 rounded-[1.5rem] px-7 py-5 text-sm font-mono focus:bg-white/20 focus:border-white outline-none transition-all placeholder:text-white/30 text-white shadow-inner" 
                      placeholder="GMAIL_IDENTITY" 
                    />
                  </div>

                  <div className="relative">
                    <input 
                      required 
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-white/10 border border-white/40 rounded-[1.5rem] px-7 py-5 text-sm font-mono focus:bg-white/20 focus:border-white outline-none transition-all placeholder:text-white/30 text-white shadow-inner" 
                      placeholder="PASSWORD" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full bg-white text-black py-5.5 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 transition-all shadow-[0_15px_40px_rgba(255,255,255,0.25)] active:scale-95 disabled:opacity-50 mt-8 overflow-hidden relative"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" /> 
                      {mode === 'login' ? 'Sync Profile' : 'Join Hub'}
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {regStep === 'verify' && (
            <div className="space-y-10 animate-in zoom-in duration-500">
               <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/10 border border-white/40 rounded-[1.8rem] flex items-center justify-center mx-auto mb-5">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Sync Verification</h3>
                  <p className="text-[11px] text-white/50 uppercase tracking-widest leading-relaxed">
                    Code dispatched to node:<br />
                    <span className="text-white font-mono font-bold">{formData.email}</span>
                  </p>
               </div>

               <div className="flex justify-between gap-3 px-1">
                 {otp.map((digit, idx) => (
                   <input
                     key={idx}
                     id={`otp-mobile-${idx}`}
                     type="text"
                     value={digit}
                     onChange={(e) => handleOtpChange(idx, e.target.value)}
                     className="w-11 h-15 bg-white/10 border border-white/40 rounded-[1.2rem] text-center text-xl font-bold font-mono text-white focus:border-white outline-none transition-all shadow-inner"
                     maxLength={1}
                   />
                 ))}
               </div>

               <div className="space-y-4 pt-6">
                 <button 
                   onClick={verifyAndCreateAccount}
                   disabled={isLoading}
                   className="w-full bg-white text-black py-5.5 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 shadow-2xl"
                 >
                   {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Verify Link</>}
                 </button>
                 <button 
                  onClick={() => setRegStep('details')}
                  className="w-full text-[11px] font-black text-white/40 uppercase tracking-[0.4em] hover:text-white transition-colors py-2"
                 >
                  Revise Identity
                 </button>
               </div>
            </div>
          )}

          {regStep === 'success' && (
            <div className="space-y-12 animate-in zoom-in duration-500 text-center py-8">
               <div className="w-24 h-24 bg-sky-400/20 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-white/60 shadow-[0_0_60px_rgba(255,255,255,0.25)]">
                  <CheckCircle2 className="w-12 h-12 text-white" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black uppercase text-white tracking-tight leading-none">Node Synced</h3>
                  <p className="text-[12px] font-mono text-white/50 uppercase tracking-widest leading-relaxed">
                    Profile successfully integrated.<br />Proceed to domestic hub.
                  </p>
               </div>
               <button 
                onClick={() => { setMode('login'); setRegStep('details'); setError(null); }}
                className="w-full bg-white text-black py-6 rounded-[2.2rem] font-black text-[12px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 shadow-2xl active:scale-95"
              >
                Access Hub <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-6 opacity-30 mt-6 grayscale">
            <div className="flex items-center gap-6">
               <Shield className="w-5 h-5 text-white" />
               <div className="w-[1px] h-5 bg-white/40" />
               <Fingerprint className="w-5 h-5 text-white" />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.8em] text-center max-w-[240px] leading-relaxed">
              SJLO-AIR-GATE-7834
            </p>
        </div>
      </div>

      <style>{`
        @keyframes rotate-slow-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow-ccw {
          animation: rotate-slow-ccw 20s linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default StartupGate;
