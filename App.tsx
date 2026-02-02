
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
import { UserActivity, SystemNotification, UserProfile } from './types.ts';

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
  
  const [publicUser, setPublicUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sjl_public_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('sjl_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [activities, setActivities] = useState<UserActivity[]>(() => {
    const saved = localStorage.getItem('sjl_user_activities');
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
    }, 3500);
  }, []);

  // Listen for broadcast events from Admin
  useEffect(() => {
    const handleBroadcast = (e: any) => {
      if (e.detail) {
        addNotification({
          type: e.detail.type || 'info',
          message: e.detail.message,
          sender: 'Admin Node'
        });
      }
    };
    window.addEventListener('sjl_broadcast', handleBroadcast);
    return () => window.removeEventListener('sjl_broadcast', handleBroadcast);
  }, [addNotification]);

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
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
    setPublicUser(null);
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
          <WifiOff className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black uppercase text-white mb-2">Offline</h1>
          <p className="text-slate-500 text-xs tracking-widest uppercase mb-8">Connection lost</p>
          <div className="w-12 h-1 bg-blue-500/20 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03040a] text-white flex flex-col font-sans selection:bg-blue-500/40">
      
      {/* Toast System */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-sm pointer-events-none flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto bg-blue-600/20 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-xl animate-in slide-in-from-top-4 duration-300 flex items-center gap-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
               toast.type === 'update' ? 'bg-blue-500/20 text-blue-400' : 
               toast.type === 'security' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {toast.type === 'update' ? <Sparkles className="w-4 h-4" /> : toast.type === 'security' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <p className="text-[11px] font-bold text-white">{toast.message}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] safe-top glass-card border-b border-white/5 backdrop-blur-[30px]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Sajilo Hub</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">OS_v4.2.0</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <button 
                  onClick={() => { setIsNotifOpen(!isNotifOpen); markNotifsRead(); }}
                  className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center relative ${
                    isNotifOpen ? 'bg-blue-500 text-white border-blue-400' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-blue-500 rounded-full border-2 border-[#03040a] flex items-center justify-center animate-bounce">
                      <span className="text-[8px] font-black text-white px-1">{unreadCount}</span>
                    </div>
                  )}
                </button>
                
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute top-14 right-0 w-[300px] bg-[#111827]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[120]">
                      <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-2">
                           <BellRing className="w-4 h-4 text-blue-400" /> Alerts
                        </span>
                        <button onClick={clearNotifications} className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center opacity-30">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clear</span>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                 n.type === 'update' ? 'bg-blue-500/20 text-blue-400' : 
                                 n.type === 'security' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                               }`}>
                                 <Info className="w-4 h-4" />
                               </div>
                               <div className="flex flex-col gap-1 flex-1">
                                 <div className="flex justify-between items-center">
                                   <span className="text-[7px] font-black uppercase text-blue-500/60">{n.sender || 'System'}</span>
                                   <span className="text-[7px] font-mono text-slate-600 uppercase">
                                     {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </span>
                                 </div>
                                 <p className="text-[11px] font-medium text-slate-300 leading-tight">{n.message}</p>
                               </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
             </div>

             <button onClick={openAdmin} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all text-blue-400">
                <Shield className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 mt-[72px] pb-[90px] overflow-y-auto px-6 pt-6 custom-scrollbar">
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-900 to-[#03040a] p-10 shadow-2xl group border border-white/5">
              <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-6">Digitizing <br /> Nepal.</h1>
                <p className="text-[12px] text-blue-100/60 font-medium uppercase tracking-widest mb-10">Premium Domestic <br />Engineering Node.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveTab('services')}
                    className="bg-white text-black px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                  >
                    Services
                  </button>
                  <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                    Portfolio
                  </button>
                </div>
              </div>
              <Activity className="absolute bottom-[-30px] right-[-30px] w-64 h-64 text-white/5 rotate-12" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="glass-card p-8 rounded-[2rem] border-white/5 transition-all">
                  <Zap className="w-6 h-6 text-blue-400 mb-6" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Latency</h3>
                  <p className="text-[10px] text-slate-500 font-mono">14MS AVG</p>
               </div>
               <div className="glass-card p-8 rounded-[2rem] border-white/5 transition-all">
                  <Shield className="w-6 h-6 text-emerald-400 mb-6" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Node</h3>
                  <p className="text-[10px] text-slate-500 font-mono">STABLE</p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Quick Access</h4>
                 <ChevronRight className="w-4 h-4 text-slate-700" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                 {GOV_FORMS.slice(0, 2).map(form => (
                   <button 
                    key={form.id}
                    onClick={() => setSelectedForm(form)}
                    className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-[2rem] active:bg-blue-600/10 transition-all hover:bg-white/10 group"
                   >
                     <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-white/5">
                          {getIcon(form.icon, "w-5 h-5")}
                        </div>
                        <p className="text-xs font-bold text-white uppercase tracking-tight">{form.title}</p>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-800 group-hover:translate-x-1 transition-transform" />
                   </button>
                 ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <h2 className="text-2xl font-black uppercase text-white px-2">Core Solutions</h2>
            <div className="grid grid-cols-1 gap-4">
               {SERVICES.filter(s => {
                  if (s.id === 'wifi-topup') return systemConfig.wifiTopup;
                  if (s.id === 'game-topup') return systemConfig.gameTopup;
                  if (s.id === 'uni-projects') return systemConfig.uniProjects;
                  return true;
               }).map(service => (
                 <button 
                  key={service.id}
                  onClick={() => handleServiceAction(service.id)}
                  className="glass-card p-8 rounded-[2.5rem] border-white/5 text-left active:scale-[0.98] transition-all hover:bg-white/5 group shadow-lg"
                 >
                   <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-white/5 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all">
                     {getIcon(service.icon, "w-6 h-6")}
                   </div>
                   <h3 className="text-lg font-black uppercase text-white mb-2">{service.title}</h3>
                   <p className="text-[11px] text-slate-500 uppercase tracking-wide leading-relaxed">{service.description}</p>
                 </button>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'portals' && (
           <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <h2 className="text-2xl font-black uppercase text-white px-2">Citizen Portals</h2>
              <div className="grid grid-cols-1 gap-4">
                 {GOV_FORMS.map(form => (
                   <div key={form.id} className="glass-card p-8 rounded-[2.5rem] border-white/5 group shadow-xl">
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-white/5 text-blue-400 flex items-center justify-center">
                           {getIcon(form.icon, "w-6 h-6")}
                        </div>
                        <h3 className="text-base font-black uppercase text-white">{form.title}</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedForm(form)}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                      >
                        Start Application
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'ai' && (
           <div className="h-full flex flex-col animate-in fade-in duration-500">
             <div className="flex-1 overflow-hidden rounded-[2.5rem] border border-white/5 relative bg-[#111827]/40">
                <AIChat embedded={true} />
             </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
             <h2 className="text-2xl font-black uppercase text-white px-2">Profile Node</h2>
             {publicUser ? (
               <div className="space-y-8">
                  <div className="glass-card p-10 rounded-[3rem] border-white/5 flex flex-col items-center text-center gap-6">
                     <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <UserIcon className="w-10 h-10 text-blue-500" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase text-white">{publicUser.name}</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">{publicUser.email}</p>
                     </div>
                     <button 
                        onClick={logoutPublic}
                        className="px-8 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[9px] font-black uppercase text-red-400 tracking-widest transition-all"
                     >
                        Log Out
                     </button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Activity Feed</h4>
                    {activities.length === 0 ? (
                      <div className="p-12 text-center opacity-20">
                         <span className="text-[10px] font-black uppercase tracking-widest">No activities logged</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activities.map((act) => (
                          <div key={act.id} className="glass-card p-6 rounded-[1.5rem] border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                                  {getActivityIcon(act.type)}
                               </div>
                               <div>
                                  <h5 className="text-xs font-bold text-white">{act.title}</h5>
                                  <span className="text-[9px] text-slate-600 uppercase">{new Date(act.timestamp).toLocaleDateString()}</span>
                               </div>
                            </div>
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${act.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                               {act.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
             ) : (
               <div className="glass-card p-12 rounded-[3rem] border-white/5 text-center space-y-8">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto">
                    <UserPlus className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase text-white">Guest Access</h3>
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest">Login for localized tracking</p>
                  </div>
                  <button 
                    onClick={() => setIsPublicAuthOpen(true)}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95"
                  >
                    Authenticate
                  </button>
               </div>
             )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[110] glass-card border-t border-white/5 backdrop-blur-[30px] safe-bottom">
        <div className="flex items-center justify-between px-6 py-4">
          {[
            { id: 'home', icon: Home, label: 'HUB' },
            { id: 'services', icon: LayoutGrid, label: 'CORE' },
            { id: 'portals', icon: Zap, label: 'GATE' },
            { id: 'ai', icon: Bot, label: 'AI' },
            { id: 'account', icon: UserIcon, label: 'USER' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-500 scale-110' : 'text-slate-600'}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
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
              type: 'info',
              message: `Link established: Welcome ${userData.name}.`
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
