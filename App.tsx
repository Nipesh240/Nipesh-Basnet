
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
  // Fix: Added missing icons
  RefreshCw,
  ShieldCheck
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
  
  // Auth States
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Admin login
  
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
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 20);
      localStorage.setItem('sjl_notifications', JSON.stringify(updated));
      return updated;
    });
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
    
    // Initial Update Notification (Simulated)
    const hasSeenUpdate = localStorage.getItem('sjl_update_v420_notified');
    if (!hasSeenUpdate) {
      addNotification({
        type: 'update',
        message: 'Sajilo OS v4.2.0 deployed. New University Project Node and Account Sync active.'
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
      const updated = [newActivity, ...prev].slice(0, 50); // Keep last 50
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
          <WifiOff className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black uppercase text-white mb-2">Offline Node</h1>
          <p className="text-slate-500 text-xs tracking-widest uppercase mb-8">Waiting for domestic uplink...</p>
          <div className="w-12 h-1 bg-amber-500/20 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  // Pre-App Login Gate
  if (!isAppUnlocked) {
    return (
      <StartupGate 
        onUnlock={(userData) => {
          setPublicUser(userData);
          localStorage.setItem('sjl_public_user', JSON.stringify(userData));
          localStorage.setItem('sjl_app_unlocked', 'true');
          setIsAppUnlocked(true);
          // Add notification for login save
          addNotification({
            type: 'security',
            message: `Login successful. Identity ${userData.name} synchronized and data saved locally.`
          });
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#03040a] text-white flex flex-col font-sans selection:bg-blue-500/40">
      
      {/* HUD Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] safe-top glass-card border-b border-white/5 backdrop-blur-3xl">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Sajilo Hub</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">OS_v4.2.0_NODE_KTM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <button 
                  onClick={() => { setIsNotifOpen(!isNotifOpen); markNotifsRead(); }}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative active:scale-95 transition-transform"
                >
                  <Bell className={`w-5 h-5 transition-colors ${isNotifOpen ? 'text-blue-500' : 'text-slate-400'}`} />
                  {unreadCount > 0 && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#03040a] flex items-center justify-center">
                      <span className="text-[8px] font-black text-white">{unreadCount}</span>
                    </div>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {isNotifOpen && (
                  <div className="absolute top-14 right-0 w-[300px] glass-card border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[120]">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/2">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Alerts</span>
                      <button onClick={clearNotifications} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-700 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center flex flex-col items-center gap-3 opacity-30">
                          <Bell className="w-6 h-6" />
                          <span className="text-[9px] font-black uppercase tracking-widest">All protocols nominal</span>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex gap-3">
                              <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                n.type === 'update' ? 'bg-blue-500/10 text-blue-500' : 
                                n.type === 'security' ? 'bg-emerald-500/10 text-emerald-500' : 
                                'bg-slate-500/10 text-slate-500'
                              }`}>
                                {n.type === 'update' ? <RefreshCw className="w-4 h-4" /> : 
                                 n.type === 'security' ? <ShieldCheck className="w-4 h-4" /> : 
                                 <Info className="w-4 h-4" />}
                              </div>
                              <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-bold text-slate-200 leading-relaxed uppercase">{n.message}</p>
                                <span className="text-[7px] font-mono text-slate-700">{new Date(n.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-4 border-t border-white/5 bg-black/20 text-center">
                       <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">Authorized Hub Logs</span>
                    </div>
                  </div>
                )}
             </div>

             {publicUser && (
               <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest truncate max-w-[80px]">{publicUser.name}</span>
               </div>
             )}
             <button onClick={openAdmin} className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all group">
                <Shield className="w-5 h-5 text-blue-500 group-hover:text-white" />
             </button>
          </div>
        </div>
      </header>

      {/* Viewport Area */}
      <main className="flex-1 mt-[72px] pb-[90px] overflow-y-auto px-6 pt-6">
        
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 p-8 shadow-2xl shadow-blue-900/20">
              <div className="relative z-10">
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Digitizing <br /> The Nation.</h1>
                <p className="text-[11px] text-blue-100/70 font-medium tracking-widest uppercase mb-8">Professional domestic engineering node.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveTab('services')}
                    className="bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
                  >
                    Launch
                  </button>
                </div>
              </div>
              <Activity className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-white/5 rotate-12" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="glass-card p-6 rounded-[2rem] border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                     <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">Active Sync</h3>
                  <p className="text-[9px] text-slate-500 uppercase">Latency: 14ms</p>
               </div>
               <div className="glass-card p-6 rounded-[2rem] border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                     <Shield className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">Node Status</h3>
                  <p className="text-[9px] text-slate-500 uppercase">Operational</p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Priority Portals</h4>
                 <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {GOV_FORMS.slice(0, 2).map(form => (
                   <button 
                    key={form.id}
                    onClick={() => setSelectedForm(form)}
                    className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-[1.5rem] active:bg-white/10 transition-colors"
                   >
                     <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500">
                          {getIcon(form.icon, "w-5 h-5")}
                        </div>
                        <div>
                           <p className="text-[11px] font-bold text-white uppercase">{form.title}</p>
                           <p className="text-[9px] text-slate-500 uppercase">Citizen Service Portal</p>
                        </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-slate-700" />
                   </button>
                 ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <div className="px-2 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Capabilities</h2>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Sajilo Infrastructure Hub</p>
              </div>
            </div>
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
                  className="glass-card p-6 rounded-[2.5rem] border-white/10 text-left active:scale-[0.98] transition-transform flex flex-col items-start gap-4"
                 >
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500">
                     {getIcon(service.icon, "w-6 h-6")}
                   </div>
                   <div>
                     <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">{service.title}</h3>
                     <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">{service.description}</p>
                   </div>
                   <div className="w-full h-[1px] bg-white/5 mt-2" />
                   <div className="flex items-center gap-2 text-[8px] font-black text-blue-500 uppercase tracking-widest">
                      Enter Module <ChevronRight className="w-3 h-3" />
                   </div>
                 </button>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'portals' && (
           <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <div className="px-2">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Gov Portals</h2>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Citizen Link Infrastructure</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {GOV_FORMS.map(form => (
                   <div key={form.id} className="glass-card p-8 rounded-[2.5rem] border-white/10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                           {getIcon(form.icon, "w-6 h-6")}
                        </div>
                        <div>
                           <h3 className="text-sm font-black uppercase tracking-widest text-white">{form.title}</h3>
                           <p className="text-[10px] text-slate-500 uppercase font-mono">{form.id.toUpperCase()}_v1.0</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedForm(form)}
                        className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                      >
                        Initiate Application
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'ai' && (
          <div className="h-full flex flex-col animate-in fade-in duration-500">
             <div className="flex-1 overflow-hidden rounded-[3rem] border border-white/5 relative">
                <AIChat embedded={true} />
             </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
             <div className="px-2">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Node Profile</h2>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Authorized Data & Service History</p>
             </div>

             {publicUser && (
               <div className="space-y-6">
                  <div className="glass-card p-10 rounded-[3rem] border-white/10 flex flex-col items-center text-center gap-6">
                     <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center overflow-hidden">
                        <UserIcon className="w-12 h-12 text-blue-500" />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase text-white tracking-tight">{publicUser.name}</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{publicUser.email}</p>
                     </div>
                     <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Identity_Verified</span>
                     </div>
                     <button 
                        onClick={logoutPublic}
                        className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-red-500 tracking-[0.3em] hover:text-red-400 transition-colors"
                     >
                        <LogOut className="w-3 h-3" /> Terminate Link
                     </button>
                  </div>

                  {/* Activity History - User "Work" Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                          <History className="w-3.5 h-3.5" /> Service_History
                       </h4>
                       <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">{activities.length} Records</span>
                    </div>

                    {activities.length === 0 ? (
                      <div className="glass-card p-10 rounded-[2.5rem] border-white/10 flex flex-col items-center gap-4 text-center">
                         <Clock className="w-8 h-8 text-slate-700" />
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No active protocols detected.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activities.map((act) => (
                          <div key={act.id} className="glass-card p-5 rounded-3xl border-white/5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                  {getActivityIcon(act.type)}
                               </div>
                               <div>
                                  <h5 className="text-[11px] font-black text-white uppercase tracking-tight">{act.title}</h5>
                                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">{act.details}</p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                     <span className="text-[7px] text-slate-700 uppercase">{new Date(act.timestamp).toLocaleDateString()}</span>
                                     <span className="w-1 h-1 rounded-full bg-slate-800" />
                                     <span className={`text-[7px] font-black uppercase tracking-widest ${
                                        act.status === 'completed' ? 'text-emerald-500' : 'text-blue-500'
                                     }`}>{act.status}</span>
                                  </div>
                               </div>
                            </div>
                            <button className="p-2 text-slate-700 hover:text-white transition-colors">
                               <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="glass-card p-10 rounded-[3rem] border-white/10 text-center space-y-6 opacity-60">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">System Core Admin</p>
                    <button 
                      onClick={openAdmin}
                      className="w-full bg-blue-600/10 border border-blue-500/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-500 active:scale-95 transition-transform"
                    >
                       {isLoggedIn ? 'Launch Admin Panel' : 'Admin Terminal'}
                    </button>
                 </div>
               </div>
             )}
             
             <div className="p-8 bg-white/2 rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-4 text-center opacity-40">
                <Logo className="w-8 h-8 text-slate-700" />
                <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">SJL-OS Build_7834_STABLE</p>
             </div>
          </div>
        )}

      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[110] glass-card border-t border-white/10 backdrop-blur-3xl safe-bottom">
        <div className="flex items-center justify-between px-6 py-4">
          {[
            { id: 'home', icon: Home, label: 'Hub' },
            { id: 'services', icon: LayoutGrid, label: 'Core' },
            { id: 'portals', icon: Zap, label: 'Gate' },
            { id: 'ai', icon: Bot, label: 'Expert' },
            { id: 'account', icon: UserIcon, label: publicUser ? 'Me' : 'Join' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className="flex flex-col items-center gap-1.5 transition-all relative group"
              >
                {isActive && <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]" />}
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'text-blue-500' : 'text-slate-500 group-active:text-slate-300'}`}>
                   <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-blue-500' : 'text-slate-700'}`}>
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
              message: `New account verified: ${userData.name}. Login data saved to local secure storage.`
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
              message: 'Administrative Terminal uplink established. Remote configuration active.'
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
