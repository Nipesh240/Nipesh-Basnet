
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Workflow,
  MapPin,
  Flag,
  FileSearch,
  Check,
  Wifi,
  Gamepad2,
  Mail,
  Loader2,
  X,
  MessageSquare,
  Globe,
  Terminal,
  Activity,
  Cpu,
  Database,
  Layers,
  Search,
  Zap,
  Lock,
  Box,
  User,
  ExternalLink,
  Code,
  LogIn,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { SERVICES, GOV_FORMS, getIcon, Logo } from './constants';
import AIChat from './components/AIChat';
import FormAssistant from './components/FormAssistant';
import WifiTopupAssistant from './components/WifiTopupAssistant';
import GameTopupAssistant from './components/GameTopupAssistant';
import AdminLogin from './components/AdminLogin';

const HUDOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] border-[20px] border-transparent">
    <div className="absolute top-0 left-0 w-32 h-32 border-t-[1px] border-l-[1px] border-white/10 opacity-30" />
    <div className="absolute top-0 right-0 w-32 h-32 border-t-[1px] border-r-[1px] border-white/10 opacity-30" />
    <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[1px] border-l-[1px] border-white/10 opacity-30" />
    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[1px] border-r-[1px] border-white/10 opacity-30" />
    
    <div className="absolute top-1/2 -left-2 w-1.5 h-64 bg-white/5 -translate-y-1/2 blur-[2px]" />
    <div className="absolute top-1/2 -right-2 w-1.5 h-64 bg-white/5 -translate-y-1/2 blur-[2px]" />
  </div>
);

const FloatingDataPoint = ({ delay, top, left, label, value }: { delay: number, top: string, left: string, label: string, value: string }) => (
  <div 
    className="absolute hidden 2xl:flex flex-col gap-1 glass-card p-3 rounded-lg border-blue-500/20 animate-float pointer-events-none"
    style={{ top, left, animationDelay: `${delay}s` }}
  >
    <span className="text-[7px] font-black uppercase text-blue-400 tracking-widest">{label}</span>
    <span className="text-[10px] font-bold text-white font-mono">{value}</span>
  </div>
);

const SystemStatus = ({ isAdmin }: { isAdmin: boolean }) => (
  <div className="fixed top-28 left-10 z-[40] hidden xl:flex flex-col gap-5">
    <div className="glass-card rounded-2xl p-4 flex items-center gap-4 border-l-4 border-l-emerald-500 group transition-all hover:bg-white/5">
      <div className="relative">
        <Activity className="w-5 h-5 text-emerald-500" />
        <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20" />
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">Network Status</span>
        <span className="text-[11px] font-bold text-white tracking-widest">LIVE_NODE_UP</span>
      </div>
    </div>
    {isAdmin && (
      <div className="glass-card rounded-2xl p-4 flex items-center gap-4 border-l-4 border-l-blue-500 group transition-all hover:bg-blue-500/10 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        <div className="relative">
          <ShieldCheck className="w-5 h-5 text-blue-500" />
          <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40" />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase text-blue-400 tracking-[0.2em]">Admin Active</span>
          <span className="text-[11px] font-bold text-white tracking-widest">SECURE_SHELL</span>
        </div>
      </div>
    )}
  </div>
);

const ConsultationModal = ({ onClose }: { onClose: () => void }) => {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card rounded-[3rem] p-12 shadow-2xl animate-in zoom-in duration-300 border-white/10">
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-all hover:rotate-90"><X /></button>
        
        {isSent ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="font-heading text-4xl font-black mb-4 tracking-tighter uppercase">PROTOCOL SYNCED</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">Strategic handshake complete. Our domestic engineers are analyzing your requirements node.</p>
            <button onClick={onClose} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-200 transition-all">Terminate Uplink</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Terminal className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">System.Consult</span>
                <h3 className="font-heading text-2xl font-bold tracking-tighter uppercase">Protocol Initiation</h3>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase font-black text-slate-600 tracking-[0.3em]">Subject Entity</label>
                <div className="relative">
                   <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"><Box className="w-4 h-4" /></div>
                   <input required className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4.5 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-800" placeholder="Organization / Full Name" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase font-black text-slate-600 tracking-[0.3em]">Project Vector</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-sm focus:border-blue-500 outline-none appearance-none cursor-pointer">
                  <option className="bg-black">Full-Stack Web Orchestration</option>
                  <option className="bg-black">National E-Governance Uplink</option>
                  <option className="bg-black">Fintech Integration Protocol</option>
                  <option className="bg-black">Enterprise Automation Node</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase font-black text-slate-600 tracking-[0.3em]">Comm-Link Channel</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-800" placeholder="Secure Phone / Matrix Email" />
              </div>
              <button 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 active:scale-95 mt-6"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Activity className="w-4 h-4" /> Initialize Secure Sync</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<typeof GOV_FORMS[0] | null>(null);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled((window as any).scrollY > 20);
    (window as any).addEventListener('scroll', handleScroll);
    return () => (window as any).removeEventListener('scroll', handleScroll);
  }, []);

  const handleServiceAction = (serviceId: string) => {
    if (serviceId === 'wifi-topup') setIsWifiModalOpen(true);
    else if (serviceId === 'game-topup') setIsGameModalOpen(true);
    else setIsConsultOpen(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#03040a] text-white font-sans selection:bg-blue-500/40 overflow-x-hidden animate-in fade-in duration-1000">
      <HUDOverlay />
      <SystemStatus isAdmin={isAdmin} />
      
      {/* Cinematic Backgrounds */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="orb top-[-20%] left-[-10%] opacity-30" />
      <div className="orb bottom-[-20%] right-[-10%] opacity-30 !bg-purple-600" />
      <div className="orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 !bg-white" />

      {/* Navigation: The Floating Node */}
      <nav className={`fixed w-full z-[110] transition-all duration-700 ${scrolled ? 'top-4 px-4' : 'top-0'}`}>
        <div className={`max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? 'glass-card py-4 rounded-[2rem] border-white/20' : 'bg-transparent py-8 border-transparent'}`}>
          <div className="flex items-center gap-3 md:gap-4 cursor-pointer group shrink-0" onClick={() => (window as any).scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="relative shrink-0">
              <Logo className="w-10 h-10 md:w-12 md:h-12 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl md:text-2xl lg:text-3xl tracking-tighter uppercase leading-tight whitespace-nowrap transition-all text-white">
                SAJILO <span className="text-blue-500">PROJECT HUB</span>
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[8px] md:text-[9px] text-emerald-500 font-black uppercase tracking-[0.3em] opacity-80">
                   {isAdmin ? 'Admin_Session_V4' : 'Public_Gateway_Active'}
                 </span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-5 xl:gap-8 ml-4">
            {['Services', 'Gov-Forms', 'Methodology'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] xl:text-[11px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.3em] hover:tracking-[0.4em] relative group whitespace-nowrap">
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all" />
              </a>
            ))}
            
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <button 
                  onClick={handleLogout}
                  className="group relative flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] xl:text-[11px] font-black uppercase tracking-[0.3em] transition-all text-red-500/80 hover:text-red-500 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" />
                  LOCK TERMINAL
                </button>
              ) : (
                <button 
                  onClick={() => setIsAdminModalOpen(true)}
                  className="group relative flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] xl:text-[11px] font-black uppercase tracking-[0.3em] transition-all text-blue-500/80 hover:text-blue-400 border border-blue-500/10 hover:border-blue-500/30 hover:bg-blue-500/5 whitespace-nowrap"
                >
                  <ShieldAlert className="w-4 h-4" />
                  ADMIN ACCESS
                </button>
              )}

              <button 
                onClick={() => setIsConsultOpen(true)}
                className="relative group overflow-hidden bg-white text-black px-6 xl:px-8 py-3.5 rounded-2xl text-[10px] xl:text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:pr-12 shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0"
              >
                <span className="relative z-10 flex items-center gap-2">INITIALIZE <ChevronRight className="w-4 h-4" /></span>
                <div className="absolute inset-0 bg-blue-500 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <button 
              onClick={() => isAdmin ? handleLogout() : setIsAdminModalOpen(true)}
              className={`p-2 glass-card rounded-xl ${isAdmin ? 'text-red-500/70' : 'text-blue-500/70'}`}
            >
              {isAdmin ? <LogOut className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </button>
            <div className="p-2 glass-card rounded-xl">
              <Layers className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-80 pb-64 px-10 overflow-hidden text-center">
        <FloatingDataPoint top="25%" left="5%" delay={0} label="Network_Load" value="Optimal" />
        <FloatingDataPoint top="40%" left="80%" delay={2} label="Security_Tier" value="Sovereign" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-16 animate-in fade-in slide-in-from-top-12 duration-1000">
             {isAdmin ? (
               <><ShieldCheck className="w-4 h-4 text-emerald-500" /> Admin Node Synchronized</>
             ) : (
               <><Globe className="w-4 h-4 text-blue-500" /> Domestic Hub Gateway</>
             )}
          </div>
          
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[11rem] font-black tracking-tighter mb-14 leading-[0.85] glow-text animate-in fade-in slide-in-from-bottom-12 duration-1000">
            DIGITAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white uppercase">Sovereign.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-500 max-w-4xl mx-auto mb-20 leading-relaxed font-light">
            Empowering the nation with high-performance digital orchestration. Professional e-governance and domestic enterprise scaling.
          </p>

          <div className="flex flex-wrap justify-center gap-10">
            <button 
              onClick={() => document.getElementById('gov-forms')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-white text-black px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] transition-all hover:scale-110 shadow-2xl"
            >
              ACCESS PORTAL
            </button>
            <button 
              onClick={() => setIsConsultOpen(true)}
              className="glass-card border-white/10 px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all flex items-center gap-4"
            >
              SYSTEM SPECS <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <section id="gov-forms" className="py-64 px-10 bg-[#010105]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32">
            <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] mb-6 block">Section_01</span>
            <h2 className="font-heading text-5xl md:text-9xl font-black tracking-tighter uppercase">ADMIN <br /> MATRIX.</h2>
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

      <section id="services" className="py-64 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-40">
            <h2 className="font-heading text-5xl md:text-[10rem] font-black tracking-tighter uppercase leading-none">CAPABILITIES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {SERVICES.map((service) => (
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

      {/* Footer */}
      <footer className="bg-[#010103] py-48 px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <Logo className="w-16 h-16 text-blue-500 mb-12" />
          <h2 className="font-heading text-4xl font-black uppercase tracking-tighter mb-8">SAJILO <span className="text-blue-500">PROJECT HUB</span></h2>
          <div className="flex flex-col gap-6 items-center">
             <div className="flex gap-10 text-[10px] font-black text-slate-600 uppercase tracking-widest">
               <a href="#" className="hover:text-white transition-colors">Security</a>
               <a href="#" className="hover:text-white transition-colors">Manifesto</a>
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
             </div>
             <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em]">© 2025 NATIONAL SECURITY TIER ENGINEERING</p>
             
             {/* Designer Signature */}
             <div className="mt-8 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-all">
                <Code className="w-4 h-4 text-blue-500" />
                <div className="flex flex-col text-left">
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Lead Engineer</span>
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight">Nipesh Basnet</span>
                </div>
             </div>
          </div>
        </div>
      </footer>

      <AIChat />
      
      {isAdminModalOpen && (
        <AdminLogin 
          onBack={() => setIsAdminModalOpen(false)} 
          onLogin={(success) => {
            setIsAdmin(success);
            setIsAdminModalOpen(false);
          }} 
        />
      )}

      {selectedForm && (
        <FormAssistant form={selectedForm} onClose={() => setSelectedForm(null)} />
      )}
      
      {isWifiModalOpen && (
        <WifiTopupAssistant onClose={() => setIsWifiModalOpen(false)} />
      )}
      
      {isGameModalOpen && (
        <GameTopupAssistant onClose={() => setIsGameModalOpen(false)} />
      )}

      {isConsultOpen && (
        <ConsultationModal onClose={() => setIsConsultOpen(false)} />
      )}
    </div>
  );
};

export default App;
