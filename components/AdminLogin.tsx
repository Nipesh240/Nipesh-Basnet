
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Lock, 
  ArrowLeft, 
  Zap, 
  Cpu, 
  Loader2, 
  Activity,
  ShieldCheck,
  Key,
  UserCheck,
  Globe,
  Database,
  Radio,
  Plus,
  LockKeyhole,
  Binary,
  Scan,
  User,
  Camera,
  RefreshCw,
  Eye,
  Focus,
  X
} from 'lucide-react';
import { Logo } from '../constants';

interface AdminLoginProps {
  onBack: () => void;
  onLogin: (success: boolean) => void;
}

const HUDElement = ({ top, left, label, value, delay }: { top: string, left: string, label: string, value: string, delay: string }) => (
  <div 
    className="absolute hidden lg:flex flex-col gap-1 p-3 glass-card rounded-xl border-white/5 opacity-40 animate-pulse pointer-events-none"
    style={{ top, left, animationDelay: delay }}
  >
    <span className="text-[6px] font-black uppercase tracking-[0.3em] text-blue-500">{label}</span>
    <span className="text-[9px] font-mono text-white/80">{value}</span>
  </div>
);

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onLogin }) => {
  // Face Verification States
  const [isFaceEnrolled, setIsFaceEnrolled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load enrollment state
  useEffect(() => {
    const enrolled = localStorage.getItem('face_id_enrolled') === 'true';
    setIsFaceEnrolled(enrolled);
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError("CAMERA_HARDWARE_NOT_INITIALIZED");
      setIsScanning(false);
    }
  };

  const startFaceScan = async () => {
    if (isScanning || isVerified) return;
    
    setIsScanning(true);
    setError(null);
    setScanProgress(0);

    await startCamera();

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        completeScan();
      }
    }, 60);
  };

  const completeScan = () => {
    setTimeout(() => {
      stopCamera();
      setIsScanning(false);
      
      if (!isFaceEnrolled) {
        setIsFaceEnrolled(true);
        localStorage.setItem('face_id_enrolled', 'true');
        // Success feedback
      } else {
        // Final verification success
        setIsVerified(true);
        setTimeout(() => {
          onLogin(true);
        }, 1500);
      }
    }, 500);
  };

  const resetFaceID = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFaceEnrolled(false);
    localStorage.removeItem('face_id_enrolled');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#03040a]/95 backdrop-blur-2xl flex items-center justify-center p-6 overflow-hidden animate-in fade-in duration-500">
      {/* Background Matrix & HUD Layers */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none font-mono text-[9px] text-blue-500 overflow-hidden flex flex-wrap gap-6 p-12 leading-none select-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}>
            {Math.random().toString(36).substring(2, 10).toUpperCase()} >> FACE_PNT_{i} >> {i % 2 === 0 ? 'MAPPED' : 'SECURE'}
          </div>
        ))}
      </div>

      <HUDElement top="15%" left="10%" label="FACE_REGISTRY" value={isFaceEnrolled ? "ID_STORED" : "EMPTY"} delay="0s" />
      <HUDElement top="20%" left="85%" label="SECURITY_NODE" value="FACE_ID_EXCLUSIVE" delay="1s" />

      <div className="relative w-full max-w-xl">
        {/* Portal Branding Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group mb-6">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20" />
            <div className="relative glass-card p-4 rounded-3xl border-white/10">
               <Logo className="w-16 h-16 text-blue-500" />
            </div>
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tighter uppercase text-white">
            ADMIN <span className="text-blue-500">TERMINAL</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mt-2">Secure Hub Orchestrator</p>
        </div>

        {/* Main Command Terminal */}
        <div className={`glass-card rounded-[4rem] p-10 md:p-14 border-white/5 shadow-2xl relative overflow-hidden transition-all duration-700 ${isVerified ? 'border-emerald-500/50 shadow-[0_0_80px_rgba(16,185,129,0.2)]' : ''}`}>
          
          <button onClick={onBack} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-all"><X /></button>

          {isVerified && (
            <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
               <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full border-2 border-emerald-500/50 flex items-center justify-center text-emerald-500 bg-emerald-500/10 scale-125">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
               </div>
               <span className="text-sm font-black uppercase tracking-[0.8em] text-emerald-400">ACCESS_GRANTED</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                  <Scan className="w-5 h-5" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Identity_Check</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Facial Verification</span>
               </div>
            </div>
            {isFaceEnrolled && (
              <button 
                onClick={resetFaceID}
                className="text-[8px] font-black text-slate-600 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Reset Face
              </button>
            )}
          </div>

          <div className="space-y-10">
            {/* Face Viewport */}
            <div className="flex flex-col items-center gap-6 py-12 border border-white/5 bg-white/2 rounded-[3.5rem] relative overflow-hidden">
              <div className="relative">
                <div className={`relative w-56 h-56 rounded-[3.5rem] border-2 transition-all duration-700 overflow-hidden ${
                  isScanning ? 'border-blue-500 scale-105 shadow-[0_0_60px_rgba(59,130,246,0.3)]' : 
                  isFaceEnrolled ? 'border-emerald-500/30' : 'border-white/10'
                }`}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`absolute inset-0 w-full h-full object-cover grayscale brightness-125 transition-opacity duration-1000 ${cameraActive ? 'opacity-70' : 'opacity-0'}`}
                  />
                  {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                      {isFaceEnrolled ? <UserCheck className="w-20 h-20 text-emerald-500/20" /> : <User className="w-20 h-20" />}
                    </div>
                  )}
                  {isScanning && (
                    <>
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,1)] animate-face-scan z-20" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
                         <div className="grid grid-cols-5 grid-rows-5 gap-6">
                            {Array.from({length: 25}).map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: `${i * 0.08}s` }} />
                            ))}
                         </div>
                      </div>
                    </>
                  )}
                </div>

                {!isScanning && !isVerified && (
                  <button 
                    type="button"
                    onClick={startFaceScan}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 group"
                  >
                    <div className="relative bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3 transition-all hover:scale-110">
                      {isFaceEnrolled ? <><Eye className="w-4 h-4" /> Verify Identity</> : <><Focus className="w-4 h-4" /> Enroll Admin</>}
                    </div>
                  </button>
                )}
              </div>
              
              <div className="text-center mt-8">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-400 animate-pulse">Scanning Topology</span>
                    <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isFaceEnrolled ? 'text-emerald-500' : 'text-slate-600'}`}>
                      {isFaceEnrolled ? "Admin Profile Active" : "No Profile Detected"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 animate-shake">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</span>
              </div>
            )}
            
            <button 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-3 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.5em] transition-all py-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Public Gateway
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes face-scan {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        .animate-face-scan {
          position: absolute;
          animation: face-scan 2.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
