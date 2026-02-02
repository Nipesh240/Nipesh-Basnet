
import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Shield, 
  Activity, 
  Power, 
  Layout, 
  Users, 
  MessageSquare, 
  Database,
  CheckCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  LogOut,
  Signal,
  WifiOff,
  Unplug,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout: () => void;
  systemConfig: any;
  setSystemConfig: (config: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onLogout, systemConfig, setSystemConfig }) => {
  const toggleAccess = (key: string) => {
    setSystemConfig({ ...systemConfig, [key]: !systemConfig[key] });
  };

  const modules = [
    { key: 'govForms', label: 'Gov-Form Protocol', icon: <Layout className="w-5 h-5" />, desc: 'Passport & License portal visibility.' },
    { key: 'uniProjects', label: 'Academic Uplink', icon: <GraduationCap className="w-5 h-5" />, desc: 'University project module visibility.' },
    { key: 'wifiTopup', label: 'ISP Recharge Node', icon: <Signal className="w-5 h-5" />, desc: 'Domestic ISP topup availability.' },
    { key: 'gameTopup', label: 'Gaming Credit Hub', icon: <Database className="w-5 h-5" />, desc: 'UC/Diamond recharge module.' },
    { key: 'aiChat', label: 'AI Concierge Engine', icon: <MessageSquare className="w-5 h-5" />, desc: 'Floating AI strategist chat.' },
    { key: 'consultation', label: 'Strategy Intake', icon: <Users className="w-5 h-5" />, desc: 'Consultation request portal.' }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#03040a] flex items-center justify-center p-4 md:p-10 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="w-full max-w-6xl h-full glass-card rounded-[3.5rem] border-white/5 overflow-hidden flex flex-col shadow-[0_0_150px_rgba(0,112,243,0.15)]">
        
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.5em]">SJL_ADMIN_LEVEL_01</span>
              <h2 className="font-heading text-3xl font-black text-white uppercase tracking-tighter">System Orchestration</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={onLogout}
              className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
             >
               <LogOut className="w-4 h-4" /> Terminate Session
             </button>
             <button onClick={onClose} className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-black/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* System Performance Status */}
            <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-gradient-to-br from-blue-500/5 to-transparent h-fit">
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-10 flex items-center gap-3">
                 <Activity className="w-4 h-4 text-blue-500" /> Infrastructure Node Status
               </h3>
               <div className="space-y-8">
                  {[
                    { label: 'Core CPU', value: '14.2%', status: 'optimal' },
                    { label: 'Secure Buffer', value: '99.9%', status: 'synced' },
                    { label: 'Active Sessions', value: '1,284', status: 'live' }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{stat.label}</span>
                        <span className="text-lg font-bold text-white font-mono leading-none">{stat.value}</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                    </div>
                  ))}
               </div>
               
               <div className="mt-12 pt-8 border-t border-white/5">
                  {/* MASTER BLOCK TOGGLE */}
                  <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${systemConfig.globalLock ? 'bg-red-600/10 border-red-600/30 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'bg-white/2 border-white/5'}`}>
                    <div className="flex items-center justify-between mb-4">
                       <div className="p-3 rounded-xl bg-red-600/10 text-red-600">
                          <Unplug className="w-5 h-5" />
                       </div>
                       <button onClick={() => toggleAccess('globalLock')}>
                          {systemConfig.globalLock ? (
                            <ToggleRight className="w-10 h-10 text-red-600 cursor-pointer" />
                          ) : (
                            <ToggleLeft className="w-10 h-10 text-slate-700 cursor-pointer" />
                          )}
                       </button>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">GLOBAL SYSTEM LOCK</span>
                      <span className="text-[9px] text-slate-600 uppercase leading-none font-mono">Terminate All Public Access</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Access Management Area */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex flex-col gap-1">
                   <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                     <Power className="w-4 h-4 text-emerald-500" /> Module Access Control
                   </h3>
                   <p className="text-[9px] text-slate-600 font-medium uppercase tracking-widest">Toggle system modules for real-time site updates.</p>
                 </div>
                 <div className={`px-4 py-2 rounded-full border transition-colors ${systemConfig.globalLock ? 'bg-red-600/10 border-red-600/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${systemConfig.globalLock ? 'text-red-600' : 'text-emerald-500'}`}>
                      {systemConfig.globalLock ? 'LOCKDOWN_ACTIVE' : 'SYSTEM_STABLE'}
                    </span>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {modules.map((mod) => (
                   <div 
                    key={mod.key} 
                    className={`relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 group ${
                      systemConfig[mod.key] 
                        ? 'bg-white/2 border-white/10 hover:border-blue-500/30' 
                        : 'bg-red-500/5 border-red-500/10 grayscale opacity-60'
                    }`}
                   >
                     {/* Status Pulse Background */}
                     {systemConfig[mod.key] && (
                       <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     )}
                     
                     <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 rounded-2xl transition-all duration-500 ${systemConfig[mod.key] ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                          {systemConfig[mod.key] ? mod.icon : <WifiOff className="w-5 h-5" />}
                        </div>
                        <button 
                          onClick={() => toggleAccess(mod.key)}
                          className="transition-transform active:scale-90"
                        >
                          {systemConfig[mod.key] ? (
                            <ToggleRight className="w-12 h-12 text-emerald-500 cursor-pointer hover:text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-12 h-12 text-slate-700 cursor-pointer hover:text-slate-600" />
                          )}
                        </button>
                     </div>

                     <div className="space-y-2">
                        <h4 className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${systemConfig[mod.key] ? 'text-white' : 'text-red-400'}`}>
                          {mod.label}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
                          {systemConfig[mod.key] ? mod.desc : 'PROTOCOL_TERMINATED_BY_ADMIN'}
                        </p>
                     </div>
                   </div>
                 ))}
               </div>
               
               <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 flex items-center gap-8">
                 <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-8 h-8 text-amber-500" />
                 </div>
                 <div className="flex flex-col text-left">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Security Disclaimer</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
                      Access overrides take immediate effect on all client nodes. Termination of critical modules like 'Gov-Form Protocol' will lock current user sessions. 
                    </p>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/60 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">SJL-OS v4.1.2 Build_7834</span>
              </div>
              <div className="w-[1px] h-4 bg-white/5" />
              <div className="flex items-center gap-2">
                 <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin-slow" />
                 <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Local_Persistence_Sync</span>
              </div>
           </div>
           <span className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">Proprietary Administrative Core</span>
        </div>
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
