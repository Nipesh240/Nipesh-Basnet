
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Lock, 
  Zap, 
  Loader2, 
  Activity,
  ShieldCheck,
  Key,
  X,
  User,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { Logo } from '../constants.tsx';

interface AdminLoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Target Credentials Updated per request
  const TARGET_USER = "Nipeshsir2025";
  const TARGET_PASS = "9709596050";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network verification
    setTimeout(() => {
      if (username === TARGET_USER && password === TARGET_PASS) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess();
        }, 1500);
      } else {
        setIsLoading(false);
        setError("ACCESS_DENIED: INVALID_CREDENTIALS");
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#03040a]/98 backdrop-blur-3xl flex items-center justify-center p-6 overflow-hidden animate-in fade-in duration-500">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none font-mono text-[10px] text-blue-500 overflow-hidden flex flex-wrap gap-4 p-8 leading-none select-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            0x{Math.random().toString(16).substring(2, 8).toUpperCase()} // AUTH_PROTOCOL_SECURE_{i} // 
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-lg">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="relative group mb-6">
            <Logo className="w-16 h-16 text-blue-500" />
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
          <h1 className="font-heading text-4xl font-black uppercase text-white tracking-tighter">SECURE TERMINAL</h1>
          <p className="text-[10px] uppercase tracking-[0.6em] text-slate-500 mt-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            System Administrator Uplink
          </p>
        </div>

        <div className={`glass-card rounded-[3rem] p-10 md:p-14 border-white/5 shadow-2xl relative overflow-hidden transition-all duration-700 ${isSuccess ? 'border-emerald-500/50 shadow-[0_0_100px_rgba(16,185,129,0.2)]' : ''}`}>
          <button onClick={onBack} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all hover:rotate-90">
            <X className="w-6 h-6" />
          </button>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                  <ShieldCheck className="w-12 h-12 text-emerald-500" />
               </div>
               <span className="text-xl font-black uppercase tracking-[0.6em] text-emerald-400 mb-2">ACCESS GRANTED</span>
               <span className="text-[10px] font-mono text-emerald-500/60">INITIALIZING DASHBOARD...</span>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-8">
              {error && (
                <div className="flex items-center gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-xs font-mono text-red-400">{error}</span>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] flex items-center gap-2">
                   <User className="w-3 h-3" /> Identity_Handle
                </label>
                <div className="relative">
                   <input 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-sm font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-800 text-white" 
                    placeholder="ENTER_USERNAME" 
                   />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] flex items-center gap-2">
                   <Key className="w-3 h-3" /> Security_Key
                </label>
                <div className="relative">
                   <input 
                    required 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-sm font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-800 text-white" 
                    placeholder="••••••••••••" 
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
                className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <><Terminal className="w-4 h-4" /> INITIATE_UPLINK</>
                )}
              </button>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
             <p className="text-[9px] font-mono text-slate-700 uppercase tracking-[0.3em]">
               Restricted Area: All login attempts are logged for SJL-Core audits.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
