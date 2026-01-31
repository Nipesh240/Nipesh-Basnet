
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
import { Logo } from '../constants.tsx';

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
  const [isFaceEnrolled, setIsFaceEnrolled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const enrolled = localStorage.getItem('face_id_enrolled') === 'true';
    setIsFaceEnrolled(enrolled);
    return () => stopCamera();
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
      } else {
        setIsVerified(true);
        setTimeout(() => onLogin(true), 1500);
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
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none font-mono text-[9px] text-blue-500 overflow-hidden flex flex-wrap gap-6 p-12 leading-none select-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}>
            {Math.random().toString(36).substring(2, 10).toUpperCase()} >> FACE_PNT_{i} >> SECURE
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative group mb-6">
            <Logo className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="font-heading text-3xl font-black uppercase text-white">ADMIN TERMINAL</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500 mt-2">Face Recognition Protocol</p>
        </div>

        <div className={`glass-card rounded-[4rem] p-10 md:p-14 border-white/5 shadow-2xl relative overflow-hidden transition-all duration-700 ${isVerified ? 'border-emerald-500/50 shadow-[0_0_80px_rgba(16,185,129,0.2)]' : ''}`}>
          <button onClick={onBack} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-all"><X /></button>

          {isVerified && (
            <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
               <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
               <span className="text-sm font-black uppercase tracking-[0.8em] text-emerald-400">ACCESS_GRANTED</span>
            </div>
          )}

          <div className="flex flex-col items-center gap-6 py-12 border border-white/5 bg-white/2 rounded-[3.5rem] relative">
            <div className={`relative w-56 h-56 rounded-[3.5rem] border-2 overflow-hidden transition-all duration-700 ${isScanning ? 'border-blue-500 scale-105' : 'border-white/10'}`}>
              <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-1000 ${cameraActive ? 'opacity-70' : 'opacity-0'}`} />
              {!cameraActive && <User className="absolute inset-0 m-auto w-20 h-20 text-slate-700" />}
              {isScanning && <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-400 animate-face-scan z-20" />}
            </div>

            {!isScanning && !isVerified && (
              <button onClick={startFaceScan} className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-110">
                {isFaceEnrolled ? "Verify Admin" : "Enroll Face"}
              </button>
            )}

            <div className="text-center mt-4">
               <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isFaceEnrolled ? 'text-emerald-500' : 'text-slate-600'}`}>
                  {isScanning ? "Scanning Topology..." : (isFaceEnrolled ? "Profile Active" : "No Admin Data")}
               </span>
            </div>
          </div>
          
          <button onClick={onBack} className="w-full text-center text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.5em] py-8">
            Cancel and Return
          </button>
        </div>
      </div>

      <style>{`
        @keyframes face-scan { 0% { top: -5%; } 100% { top: 105%; } }
        .animate-face-scan { position: absolute; animation: face-scan 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
