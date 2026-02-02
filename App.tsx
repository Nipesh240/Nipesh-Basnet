
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Home,
  LayoutGrid,
  Zap,
  Bot,
  User as UserIcon,
  Activity,
  Box,
  Terminal,
  X,
  CheckCircle2,
  Loader2,
  Code,
  Shield,
  ShieldAlert,
  Unplug,
  WifiOff,
  ChevronRight,
  Menu,
  Bell,
  LogOut,
  UserPlus,
  LogIn,
  AlertCircle,
  Clock,
  ExternalLink,
  History,
  FileText,
  Wifi,
  Gamepad2,
  GraduationCap,
  Info,
  Trash2,
  RefreshCw,
  ShieldCheck,
  CheckCircle,
  BellRing,
  Sparkles
} from 'lucide-react';
import { SERVICES, GOV_FORMS, getIcon, Logo } from './constants.tsx';
import FormAssistant from './components/FormAssistant.tsx';
import WifiTopupAssistant from './components/WifiTopupAssistant.tsx';
import GameTopupAssistant from './components/GameTopupAssistant.tsx';
import UniversityProjectAssistant from './components/UniversityProjectAssistant.tsx';
import AIChat from './components/AIChat.tsx';
import AdminLogin from './components/AdminLogin.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import PublicAuth from './components/PublicAuth.tsx';
import StartupGate from './components/StartupGate.tsx';
import { UserActivity, SystemNotification } from './types.ts';

type TabType = 'home' | 'services' | 'portals' | 'ai' | 'account';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedForm, setSelectedForm] = useState<typeof GOV_FORMS[0] | null>(null);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isUniModalOpen, setIsUniModalOpen] = useState(false);
  const [isPublicAuthOpen, setIsPublicAuthOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const [toasts, setToasts] = useState<SystemNotification[]>([]);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  const [isAppUnlocked, setIsAppUnlocked] = useState(() => {
    return localStorage.getItem('sjl_app_unlocked') === 'true';
  });

  const [publicUser, setPublicUser] = useState<any>(() => {
    const saved = localStorage.getItem('sjl_public_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activities, setActivities] = useState<UserActivity[]>(() => {
    const saved = localStorage.getItem('sjl_user_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('sjl_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [systemConfig, setSystemConfig] = useState(() => {
    const saved = localStorage.getItem('sjl_system_config');
    return saved ? JSON.parse(saved) : {
      govForms: true,
      wifiTopup: true,
      gameTopup: true,
      uniProjects: true,
      aiChat: true,
      consultation: true,
      globalLock: false
    };
  });

  const addNotification = useCallback((notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 20);
      localStorage.setItem('sjl_notifications', JSON.stringify(updated));
      return updated;
    });

    setToasts(prev => [...prev, newNotif]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newNotif.id));
    }, 4500);
  }, []);

  const markNotifsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('sjl_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('sjl_notifications');
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const hasSeenUpdate = localStorage.getItem('sjl_update_v420_notified');
    if (!hasSeenUpdate) {
      addNotification({
        type: 'update',
        message: 'Atmospheric UI v4.2.0 Active. Ethereal Blue theme protocols initiated.'
      });
      localStorage.setItem('sjl_update_v420_notified', 'true');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  const addActivity = useCallback((activity: Omit<UserActivity, 'id' | 'timestamp'>) => {
    const newActivity: UserActivity = {
      ...activity,
      id: `ACT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 50);
      localStorage.setItem('sjl_user_activities', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleServiceAction = (serviceId: string) => {
    if (serviceId === 'wifi-topup' && systemConfig.wifiTopup) setIsWifiModalOpen(true);
    else if (serviceId === 'game-topup' && systemConfig.gameTopup) setIsGameModalOpen(true);
    else if (serviceId === 'uni-projects' && systemConfig.uniProjects) setIsUniModalOpen(true);
    else if (serviceId === 'gov-forms') setActiveTab('portals');
  };

  const openAdmin = () => {
    if (isLoggedIn) setIsAdminDashboardOpen(true);
    else setIsAdminLoginOpen(true);
  };

  const logoutPublic = () => {
    localStorage.removeItem('sjl_public_user');
    localStorage.removeItem('sjl_app_unlocked');
    localStorage.removeItem('sjl_user_activities');
    localStorage.removeItem('sjl_notifications');
    setPublicUser(null);
    setActivities([]);
    setNotifications([]);
    setIsAppUnlocked(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'gov_form': return <FileText className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'game': return <Gamepad2 className="w-4 h-4" />;
      case 'uni_project': return <GraduationCap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-[#03040a] flex items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="relative z-10">
          <WifiOff className="w-16 h-16 text-sky-400 mx-auto mb-6" />
          <h1 className="text-2xl font-black uppercase text-white mb-2">Node Offline</h1>
          <p className="text-slate-500 text-xs tracking-widest uppercase mb-8">Uplink packet lost...</p>
          <div className="w-12 h-1 bg-sky-500/20 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAppUnlocked) {
    return (
      <StartupGate 
        onUnlock={(userData) => {
          setPublicUser(userData);
          localStorage.setItem('sjl_public_user', JSON.stringify(userData));
          localStorage.setItem('sjl_app_unlocked', 'true');
          setIsAppUnlocked(true);
          addNotification({
            type: 'security',
            message: `Identity Sync: Authorized access for ${userData.name}.`
          });
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#03040a] text-white flex flex-col font-sans selection:bg-sky-500/40">
      
      {/* Classy Light Blue System Toasts - Ethereal Blur with White Classy Border */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] w-[92%] max-w-sm pointer-events-none flex flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto bg-sky-400/20 backdrop-blur-[40px] rounded-[2rem] border border-white/60 p-5 shadow-[0_15px_45px_rgba(56,189,248,0.3)] animate-in slide-in-from-top-6 duration-500 flex items-center gap-5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 ${
               toast.type === 'update' ? 'bg-sky-500/30 text-white' : 'bg-emerald-500/30 text-white'
            }`}>
              {toast.type === 'update' ? <Sparkles className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div className="flex flex-col gap-0.5">
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/70">System Alert</span>
               <p className="text-[12px] font-bold leading-tight text-white drop-shadow-sm">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* HUD Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] safe-top glass-card border-b border-white/10 backdrop-blur-[50px] shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-sky-500" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Sajilo Hub</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">OS_v4.2.0_NODE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <button 
                  onClick={() => { setIsNotifOpen(!isNotifOpen); markNotifsRead(); }}
                  className={`w-12 h-12 rounded-2xl border transition-all duration-300 flex items-center justify-center relative active:scale-95 ${
                    isNotifOpen 
                    ? 'bg-sky-400/30 text-white border-white/70 shadow-[0_0_20px_rgba(56,189,248,0.4)]' 
                    : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-sky-400 rounded-full border-2 border-[#03040a] flex items-center justify-center animate-bounce shadow-[0_0_10px_rgba(56,189,248,1)]">
                      <span className="text-[9px] font-black text-white px-1">{unreadCount}</span>
                    </div>
                  )}
                </button>
                
                {/* Advanced Ethereal Notification Panel - Light Blue Blurry with Classy Border */}
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1] bg-black/40 backdrop-blur-sm" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute top-16 right-0 w-[340px] bg-sky-500/10 backdrop-blur-[50px] border border-white/60 rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in slide-in-from-top-6 zoom-in-95 duration-500 z-[120]">
                      <div className="p-7 border-b border-white/20 flex items-center justify-between bg-white/5">
                        <div className="flex flex-col">
                           <span className="text-[12px] font-black uppercase text-white tracking-[0.3em] flex items-center gap-2">
                             <BellRing className="w-4 h-4 text-sky-300" /> Notifications
                           </span>
                           <span className="text-[8px] font-mono text-white/40 uppercase mt-1">Status_Uplink</span>
                        </div>
                        <button onClick={clearNotifications} className="p-2.5 bg-white/5 border border-white/20 rounded-xl text-white/50 hover:text-red-400 transition-all active:scale-90">
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto p-5 space-y-4 custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="py-20 text-center flex flex-col items-center gap-5 opacity-40">
                            <Sparkles className="w-10 h-10 text-sky-300" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Atmosphere Nominal</span>
                          </div>
                        ) : (
                          notifications.map((n, idx) => (
                            <div 
                              key={n.id} 
                              className={`p-5 rounded-[1.8rem] transition-all duration-500 animate-in slide-in-from-right-6 bg-white/10 border relative overflow-hidden group ${
                                !n.read ? 'border-sky-300/60 shadow-[0_5px_15px_rgba(56,189,248,0.2)]' : 'border-white/10'
                              }`}
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              {!n.read && <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-300 shadow-[0_0_10px_sky-400]" />}
                              <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 ${
                                  n.type === 'update' ? 'bg-sky-500/30 text-white' : 
                                  n.type === 'security' ? 'bg-emerald-500/30 text-white' : 
                                  'bg-white/5 text-white/50'
                                }`}>
                                  {n.type === 'update' ? <RefreshCw className="w-5 h-5" /> : 
                                   n.type === 'security' ? <ShieldCheck className="w-5 h-5" /> : 
                                   <Info className="w-5 h-5" />}
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                  <p className={`text-[12px] font-bold leading-relaxed tracking-tight ${!n.read ? 'text-white' : 'text-white/60'}`}>
                                    {n.message}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-3 h-3 text-white/40" />
                                      <span className="text-[8px] font-mono text-white/40 font-black uppercase">
                                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    {!n.read && <span className="text-[7px] font-black uppercase text-sky-300 tracking-widest animate-pulse">New Packet</span>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-5 border-t border-white/10 bg-white/5 text-center">
                         <button onClick={() => setIsNotifOpen(false)} className="text-[10px] font-black text-white/80 uppercase tracking-[0.4em] hover:text-white transition-all">
                            Collapse Portal
                         </button>
                      </div>
                    </div>
                  </>
                )}
             </div>

             {publicUser && (
               <div className="hidden sm:flex items-center gap-2.5 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest truncate max-w-[120px]">{publicUser.name}</span>
               </div>
             )}
             <button onClick={openAdmin} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all group hover:border-white shadow-xl">
                <Shield className="w-6 h-6 text-sky-400 group-hover:text-white transition-transform group-active:scale-90" />
             </button>
          </div>
        </div>
      </header>

      {/* Viewport Area */}
      <main className="flex-1 mt-[84px] pb-[100px] overflow-y-auto px-6 pt-6 custom-scrollbar">
        {/* Tab content remains consistent with the requested style */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="relative rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-sky-600 via-blue-900 to-[#03040a] p-12 shadow-2xl shadow-sky-900/30 group border border-white/5">
              <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-7 group-hover:translate-x-1 transition-transform">Digitizing <br /> The Nation.</h1>
                <p className="text-[13px] text-sky-100/60 font-medium tracking-[0.2em] uppercase mb-12">Nepal's Premier Domestic <br />Engineering Hub.</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('services')}
                    className="bg-white text-black px-10 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-sky-50"
                  >
                    Launch Core
                  </button>
                  <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all hover:bg-white/20">
                    Portfolio
                  </button>
                </div>
              </div>
              <Activity className="absolute bottom-[-40px] right-[-40px] w-72 h-72 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>

            <div className="grid grid-cols-2 gap-5">
               <div className="glass-card p-9 rounded-[2.5rem] border-white/10 hover:border-sky-400/30 transition-all group">
                  <div className="w-14 h-14 rounded-[1.5rem] bg-sky-500/10 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                     <Zap className="w-7 h-7 text-sky-400" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2">Sync Engine</h3>
                  <p className="text-[11px] text-slate-600 font-mono tracking-widest">LATENCY: 14MS</p>
               </div>
               <div className="glass-card p-9 rounded-[2.5rem] border-white/10 hover:border-purple-400/30 transition-all group">
                  <div className="w-14 h-14 rounded-[1.5rem] bg-purple-500/10 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                     <Shield className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2">Secure Node</h3>
                  <p className="text-[11px] text-slate-600 font-mono tracking-widest">STATUS: OPTIMAL</p>
               </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-3">
                 <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em]">Express Portals</h4>
                 <div className="h-[1px] flex-1 mx-8 bg-white/10" />
                 <ChevronRight className="w-5 h-5 text-slate-700" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {GOV_FORMS.slice(0, 2).map(form => (
                   <button 
                    key={form.id}
                    onClick={() => setSelectedForm(form)}
                    className="flex items-center justify-between p-7 bg-white/2 border border-white/10 rounded-[2.5rem] active:bg-sky-600/10 active:border-sky-400/40 transition-all hover:bg-white/5 shadow-lg group"
                   >
                     <div className="flex items-center gap-6 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-white/5">
                          {getIcon(form.icon, "w-6 h-6")}
                        </div>
                        <div>
                           <p className="text-[14px] font-bold text-white uppercase tracking-tight">{form.title}</p>
                           <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-medium">Protocol Secured</p>
                        </div>
                     </div>
                     <ChevronRight className="w-6 h-6 text-slate-800 group-hover:translate-x-1 transition-transform" />
                   </button>
                 ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'services' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <div className="px-3">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Capabilities</h2>
              <p className="text-[12px] font-black text-sky-400 uppercase tracking-[0.5em] mt-3">Advanced Infrastructure Nodes</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
               {SERVICES.filter(s => {
                  if (s.id === 'wifi-topup') return systemConfig.wifiTopup;
                  if (s.id === 'game-topup') return systemConfig.gameTopup;
                  if (s.id === 'uni-projects') return systemConfig.uniProjects;
                  return true;
               }).map(service => (
                 <button 
                  key={service.id}
                  onClick={() => handleServiceAction(service.id)}
                  className="glass-card p-9 rounded-[3.5rem] border-white/10 text-left active:scale-[0.98] transition-all hover:bg-white/5 group relative overflow-hidden shadow-2xl"
                 >
                   <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-sky-300 mb-8 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-inner">
                     {getIcon(service.icon, "w-8 h-8")}
                   </div>
                   <div className="space-y-3">
                     <h3 className="text-xl font-black uppercase tracking-tight text-white">{service.title}</h3>
                     <p className="text-[12px] text-slate-500 font-medium leading-relaxed uppercase tracking-wide opacity-80">{service.description}</p>
                   </div>
                   <div className="flex items-center gap-4 mt-10">
                      <div className="px-5 py-2 rounded-2xl bg-sky-500/10 border border-sky-400/20">
                        <span className="text-[9px] font-black text-sky-300 uppercase tracking-widest">Active Module</span>
                      </div>
                      <ChevronRight className="w-5 h-5 ml-auto text-slate-800 group-hover:translate-x-2 transition-transform" />
                   </div>
                 </button>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'portals' && (
           <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="px-3">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Identity Hub</h2>
                <p className="text-[12px] font-black text-sky-400 uppercase tracking-[0.5em] mt-3">Citizen Gateway Protocols</p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                 {GOV_FORMS.map(form => (
                   <div key={form.id} className="glass-card p-10 rounded-[3.5rem] border-white/10 group shadow-2xl">
                      <div className="flex items-center gap-7 mb-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-sky-500/10 border border-white/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                           {getIcon(form.icon, "w-8 h-8")}
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-white">{form.title}</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedForm(form)}
                        className="w-full bg-white text-black py-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.4em] active:scale-95 transition-all hover:bg-sky-50"
                      >
                        Initiate Protocol
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'ai' && (
           <div className="h-full flex flex-col animate-in fade-in duration-500">
             <div className="flex-1 overflow-hidden rounded-[3.5rem] border border-white/10 relative bg-black/40">
                <AIChat embedded={true} />
             </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
             <div className="px-3">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Access Vault</h2>
                <p className="text-[12px] font-black text-sky-400 uppercase tracking-[0.5em] mt-3">Personal Deployment Node</p>
             </div>
             {publicUser && (
               <div className="space-y-12">
                  <div className="glass-card p-12 rounded-[4rem] border-white/10 flex flex-col items-center text-center gap-8 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-sky-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="w-24 h-24 rounded-full bg-sky-500/10 border-2 border-sky-400/30 flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-sky-400" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase text-white tracking-tighter">{publicUser.name}</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">{publicUser.email}</p>
                     </div>
                     <button 
                        onClick={logoutPublic}
                        className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 text-[10px] font-black uppercase text-red-400 tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all active:scale-95"
                     >
                        <LogOut className="w-4 h-4" /> Terminate Link
                     </button>
                  </div>
                  <div className="space-y-8">
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] px-4">Event Stream</h4>
                    {activities.length === 0 ? (
                      <div className="glass-card p-20 rounded-[4rem] border-white/10 flex flex-col items-center gap-8 text-center opacity-20">
                         <Clock className="w-10 h-10 text-slate-500" />
                         <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-500">Zero Active Packets</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activities.map((act) => (
                          <div key={act.id} className="glass-card p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                               <div className="w-12 h-12 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center text-sky-400">
                                  {getActivityIcon(act.type)}
                               </div>
                               <div className="flex flex-col gap-1">
                                  <h5 className="text-[14px] font-bold text-white uppercase tracking-tight">{act.title}</h5>
                                  <div className="flex items-center gap-4 opacity-50">
                                     <span className="text-[9px] font-black uppercase tracking-tight">{new Date(act.timestamp).toLocaleDateString()}</span>
                                     <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${act.status === 'completed' ? 'text-emerald-400' : 'text-sky-400'}`}>{act.status}</span>
                                  </div>
                               </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-slate-700 group-hover:text-sky-400 transition-colors" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
             )}
          </div>
        )}
      </main>

      {/* Airy Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[110] glass-card border-t border-white/10 backdrop-blur-[60px] safe-bottom shadow-[0_-15px_50px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between px-9 py-6">
          {[
            { id: 'home', icon: Home, label: 'HUB' },
            { id: 'services', icon: LayoutGrid, label: 'CORE' },
            { id: 'portals', icon: Zap, label: 'GATE' },
            { id: 'ai', icon: Bot, label: 'AI' },
            { id: 'account', icon: UserIcon, label: publicUser ? 'USER' : 'JOIN' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className="flex flex-col items-center gap-2.5 transition-all relative group"
              >
                {isActive && (
                   <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-12 h-[3px] bg-sky-400 rounded-full shadow-[0_0_25px_rgba(56,189,248,1)] animate-pulse" />
                )}
                <div className={`p-1.5 transition-all duration-300 ${isActive ? 'text-sky-400 scale-125' : 'text-slate-600 group-hover:text-slate-400 group-active:scale-90'}`}>
                   <Icon className="w-6.5 h-6.5" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${isActive ? 'text-sky-400' : 'text-slate-800'}`}>
                   {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Overlays */}
      {selectedForm && <FormAssistant form={selectedForm} addActivity={addActivity} onClose={() => setSelectedForm(null)} />}
      {isWifiModalOpen && <WifiTopupAssistant addActivity={addActivity} onClose={() => setIsWifiModalOpen(false)} />}
      {isGameModalOpen && <GameTopupAssistant addActivity={addActivity} onClose={() => setIsGameModalOpen(false)} />}
      {isUniModalOpen && <UniversityProjectAssistant addActivity={addActivity} onClose={() => setIsUniModalOpen(false)} />}
      
      {isPublicAuthOpen && (
        <PublicAuth 
          onClose={() => setIsPublicAuthOpen(false)}
          onSuccess={(userData) => {
            setPublicUser(userData);
            localStorage.setItem('sjl_public_user', JSON.stringify(userData));
            setIsPublicAuthOpen(false);
            setActiveTab('account');
            addNotification({
              type: 'security',
              message: `Registration Complete: Node linked for ${userData.name}.`
            });
          }}
        />
      )}

      {isAdminLoginOpen && (
        <AdminLogin 
          onBack={() => setIsAdminLoginOpen(false)} 
          onLoginSuccess={() => {
            setIsAdminLoginOpen(false);
            setIsLoggedIn(true);
            setIsAdminDashboardOpen(true);
            addNotification({
              type: 'security',
              message: 'Administrator Uplink Stable: Remote override active.'
            });
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

export default App;
