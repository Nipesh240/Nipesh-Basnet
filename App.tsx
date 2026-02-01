
import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight,
  ChevronRight,
  Globe,
  Activity,
  Box,
  Terminal,
  X,
  CheckCircle2,
  Loader2,
  Code,
  Layers,
  Shield,
  Lock,
  ShieldAlert,
  Unplug,
  WifiOff,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { SERVICES, GOV_FORMS, getIcon, Logo } from './constants.tsx';
import FormAssistant from './components/FormAssistant.tsx';
import WifiTopupAssistant from './components/WifiTopupAssistant.tsx';
import GameTopupAssistant from './components/GameTopupAssistant.tsx';
import AIChat from './components/AIChat.tsx';
import AdminLogin from './components/AdminLogin.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';

const HUDOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] border-[20px] border-transparent">
    <div className="absolute top-0 left-0 w-32 h-32 border-t-[1px] border-l-[1px] border-white/10 opacity-30" />
    <div className="absolute top-0 right-0 w-32 h-32 border-t-[1px] border-r-[1px] border-white/10 opacity-30" />
    <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[1px] border-l-[1px] border-white/10 opacity-30" />
    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[1px] border-r-[1px] border-white/10 opacity-30" />
  </div>
);

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedForm, setSelectedForm] = useState<typeof GOV_FORMS[0] | null>(null);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Admin States
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // System Config with Persistence
  const [systemConfig, setSystemConfig] = useState(() => {
    const saved = localStorage.getItem('sjl_system_config');
    return saved ? JSON.parse(saved) : {
      govForms: true,
      wifiTopup: true,
      gameTopup: true,
      aiChat: true,
      consultation: true,
      globalLock: false
    };
  });

  // Connection Monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('sjl_system_config', JSON.stringify(systemConfig));
  }, [systemConfig]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleServiceAction = (serviceId: string) => {
    if (serviceId === 'wifi-topup' && systemConfig.wifiTopup) setIsWifiModalOpen(true);
    else if (serviceId === 'game-topup' && systemConfig.gameTopup) setIsGameModalOpen(true);
    else if (systemConfig.consultation) setIsConsultOpen(true);
  };

  const openAdmin = () => {
    if (isLoggedIn) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Offline Screen Logic
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-[#03040a] flex items-center justify-center p-8 text-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 blur-[150px] rounded-full animate-pulse" />
        
        <div className="relative z-10 max-w-xl">
          <div className="w-24 h-24 bg-amber-600/10 border border-amber-600/20 rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-[0_0_50px_rgba(217,119,6,0.2)]">
            <WifiOff className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tighter text-white uppercase mb-6 leading-none">
            UPLINK <span className="text-amber-500">TERMINATED</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-lg font-light leading-relaxed mb-12 max-w-md mx-auto">
            The Sajilo Gateway requires an active internet node to process digital orchestrations. Your domestic connection has been lost.
          </p>
          
          <div className="flex flex-col items-center gap-4">
             <div className="px-5 py-2.5 rounded-full bg-amber-500/5 border border-amber-500/10 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Attempting Re-sync...</span>
             </div>
             <p className="text-[9px] text-slate-700 font-mono uppercase tracking-widest mt-8">
               Status: NO_RESPONSE_FROM_DOMESTIC_SERVER
             </p>
          </div>
        </div>
      </div>
    );
  }

  // Blocked Screen for Public Users
  if (systemConfig.globalLock && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#03040a] flex items-center justify-center p-6 text-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 blur-[150px] rounded-full animate-pulse" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="w-24 h-24 bg-red-600/10 border border-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tighter text-white uppercase mb-6 leading-none">
            ACCESS <span className="text-red-600">RESTRICTED</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed mb-12">
            The Sajilo Domestic Gateway is currently in <span className="text-red-500 font-bold uppercase tracking-widest">Lockdown Mode</span>. All public interfaces have been terminated by the lead administrator.
          </p>
          <div className="flex flex-col items-center gap-6">
            <div className="px-6 py-3 rounded-full bg-red-600/5 border border-red-600/10">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Error_Code: SYS_GATE_TERMINATED</span>
            </div>
            <button 
              onClick={openAdmin}
              className="text-[10px] font-black text-slate-800 hover:text-slate-400 transition-colors uppercase tracking-[0.5em] mt-20"
            >
              Administrator_Login
            </button>
          </div>
        </div>

        {isAdminLoginOpen && (
          <AdminLogin 
            onBack={() => setIsAdminLoginOpen(false)} 
            onLoginSuccess={() => {
              setIsAdminLoginOpen(false);
              setIsLoggedIn(true);
              setIsAdminDashboardOpen(true);
            }} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03040a] text-white font-sans selection:bg-blue-500/40 overflow-x-hidden animate-in fade-in duration-1000">
      <HUDOverlay />
      
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="orb top-[-20%] left-[-10%] opacity-30" />
      <div className="orb bottom-[-20%] right-[-10%] opacity-30 !bg-purple-600" />

      <nav className={`fixed w-full z-[110] transition-all duration-700 ${scrolled ? 'top-4 px-4' : 'top-0'}`}>
        <div className={`max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? 'glass-card py-4 rounded-[2rem] border-white/20' : 'bg-transparent py-8 border-transparent'}`}>
          <div className="flex items-center gap-4 cursor-pointer group shrink-0" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Logo className="w-10 h-10 md:w-12 md:h-12 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl md:text-3xl tracking-tighter uppercase leading-tight text-white">
                SAJILO <span className="text-blue-500">PROJECT HUB</span>
              </span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <a href="#services" className="text-[11px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.3em]">Capabilities</a>
            {systemConfig.govForms && <a href="#gov-forms" className="text-[11px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.3em]">Access Portal</a>}
            
            {systemConfig.consultation && (
              <button 
                onClick={() => setIsConsultOpen(true)}
                className="bg-white text-black px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:bg-blue-500 hover:text-white shadow-xl"
              >
                Initialize Sync
              </button>
            )}
          </div>
        </div>
      </nav>

      <header className="relative pt-80 pb-64 px-10 text-center">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-heading text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-14 leading-[0.85] glow-text animate-in fade-in slide-in-from-bottom-12 duration-1000">
            DIGITAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white uppercase">Sovereign.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto mb-20 leading-relaxed font-light">
            Empowering the nation with high-performance digital orchestration. Professional e-governance and domestic enterprise scaling.
          </p>
        </div>
      </header>

      {systemConfig.govForms && (
        <section id="gov-forms" className="py-64 px-10 bg-[#010105]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-32">
              <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] mb-6 block">Section_01</span>
              <h2 className="font-heading text-5xl md:text-9xl font-black tracking-tighter uppercase">PORTAL <br /> ACCESS.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {GOV_FORMS.map((form) => (
                <div key={form.id} className="glass-card p-12 rounded-[4rem] group hover:border-blue-500/40 transition-all">
                  <div className="w-16 h-16 rounded-[2rem] mb-12 flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {getIcon(form.icon, "w-8 h-8")}
                  </div>
                  <h3 className="font-heading text-3xl font-bold mb-6 tracking-tighter uppercase">{form.title}</h3>
                  <p className="text-slate-600 text-base mb-12 font-light">{form.description}</p>
                  <button onClick={() => setSelectedForm(form)} className="w-full bg-white text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all">START PROTOCOL</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="services" className="py-64 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-40">
            <h2 className="font-heading text-5xl md:text-[10rem] font-black tracking-tighter uppercase leading-none">CAPABILITIES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {SERVICES.filter(s => {
              if (s.id === 'wifi-topup') return systemConfig.wifiTopup;
              if (s.id === 'game-topup') return systemConfig.gameTopup;
              if (s.id === 'gov-forms') return systemConfig.govForms;
              return true;
            }).map((service) => (
              <div key={service.id} className="glass-card p-14 rounded-[4.5rem] group hover:border-white/20 transition-all">
                <div className="w-20 h-20 rounded-[2.5rem] mb-12 flex items-center justify-center bg-white/5 group-hover:text-blue-500 transition-all">
                  {getIcon(service.icon, "w-10 h-10")}
                </div>
                <h3 className="font-heading text-3xl font-bold mb-8 tracking-tighter uppercase">{service.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-16 font-light">{service.description}</p>
                <button onClick={() => handleServiceAction(service.id)} className="text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-[0.4em]">ACCESS MODULE <ChevronRight className="w-5 h-5 inline" /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#010103] py-48 px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <Logo className="w-16 h-16 text-blue-500 mb-12" />
          <h2 className="font-heading text-4xl font-black uppercase tracking-tighter mb-8">SAJILO <span className="text-blue-500">PROJECT HUB</span></h2>
          <div className="flex flex-col gap-8 items-center">
             <div className="flex gap-10 text-[10px] font-black text-slate-600 uppercase tracking-widest">
               <a href="#" className="hover:text-white transition-colors">Security</a>
               <a href="#" className="hover:text-white transition-colors">Manifesto</a>
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
             </div>
             
             <div 
              onClick={openAdmin}
              className="mt-8 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-all cursor-pointer"
             >
                <Code className="w-4 h-4 text-blue-500" />
                <div className="flex flex-col text-left">
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Lead Engineer</span>
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">Nipesh Basnet</span>
                </div>
             </div>
             
             <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em] mt-8">© 2025 NATIONAL SECURITY TIER ENGINEERING</p>
          </div>
        </div>
      </footer>

      {selectedForm && <FormAssistant form={selectedForm} onClose={() => setSelectedForm(null)} />}
      {isWifiModalOpen && <WifiTopupAssistant onClose={() => setIsWifiModalOpen(false)} />}
      {isGameModalOpen && <GameTopupAssistant onClose={() => setIsGameModalOpen(false)} />}
      {isConsultOpen && <ConsultationModal onClose={() => setIsConsultOpen(false)} />}
      {systemConfig.aiChat && <AIChat />}

      {isAdminLoginOpen && (
        <AdminLogin 
          onBack={() => setIsAdminLoginOpen(false)} 
          onLoginSuccess={() => {
            setIsAdminLoginOpen(false);
            setIsLoggedIn(true);
            setIsAdminDashboardOpen(true);
          }} 
        />
      )}

      {isAdminDashboardOpen && (
        <AdminDashboard 
          onClose={() => setIsAdminDashboardOpen(false)}
          onLogout={() => {
            setIsLoggedIn(false);
            setIsAdminDashboardOpen(false);
          }}
          systemConfig={systemConfig}
          setSystemConfig={setSystemConfig}
        />
      )}
    </div>
  );
};

const ConsultationModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card rounded-[3rem] p-12 animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-white"><X /></button>
        <div className="flex items-center gap-4 mb-8">
           <Terminal className="w-8 h-8 text-blue-500" />
           <h3 className="font-heading text-2xl font-black uppercase">Initial Sync</h3>
        </div>
        <p className="text-slate-400 mb-8">Ready to initiate digital orchestration? Provide your node details.</p>
        <input className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl mb-4 outline-none focus:border-blue-500" placeholder="Identity Handle" />
        <button className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-widest">Connect Node</button>
      </div>
    </div>
  );
};

export default App;
