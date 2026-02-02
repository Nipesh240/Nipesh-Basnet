
import React, { useState, useEffect } from 'react';
/* Added missing Loader2 import from lucide-react */
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
  GraduationCap,
  Send,
  Mail,
  Trash2,
  Calendar,
  Globe,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../types.ts';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout: () => void;
  systemConfig: any;
  setSystemConfig: (config: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onLogout, systemConfig, setSystemConfig }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'config' | 'users' | 'broadcast'>('config');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'update' | 'security' | 'info'>('info');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const rawUsers = localStorage.getItem('sjl_user_db');
    if (rawUsers) {
      setUsers(JSON.parse(rawUsers));
    }
  }, []);

  const toggleAccess = (key: string) => {
    setSystemConfig({ ...systemConfig, [key]: !systemConfig[key] });
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    setIsSending(true);
    
    // Simulate node transmission
    setTimeout(() => {
      const event = new CustomEvent('sjl_broadcast', { 
        detail: { message: broadcastMessage, type: broadcastType } 
      });
      window.dispatchEvent(event);
      
      setIsSending(false);
      setBroadcastMessage('');
      alert("Broadcast Dispatched to all nodes.");
    }, 1000);
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
             <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                <button 
                  onClick={() => setActiveAdminTab('config')}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeAdminTab === 'config' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                >
                  Config
                </button>
                <button 
                  onClick={() => setActiveAdminTab('users')}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeAdminTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                >
                  Users
                </button>
                <button 
                  onClick={() => setActiveAdminTab('broadcast')}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeAdminTab === 'broadcast' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                >
                  Broadcast
                </button>
             </div>
             <button 
              onClick={onLogout}
              className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
             >
               <LogOut className="w-4 h-4" /> Exit
             </button>
             <button onClick={onClose} className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-black/20">
          
          {activeAdminTab === 'config' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-300">
               <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-gradient-to-br from-blue-500/5 to-transparent h-fit">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-10 flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-500" /> Infrastructure Node Status
                  </h3>
                  <div className="space-y-8">
                      {[
                        { label: 'Core CPU', value: '14.2%', status: 'optimal' },
                        { label: 'Secure Buffer', value: '99.9%', status: 'synced' },
                        { label: 'Active Sessions', value: users.length.toString(), status: 'live' }
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
               </div>

               <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modules.map((mod) => (
                      <div 
                        key={mod.key} 
                        className={`p-8 rounded-[2.5rem] border transition-all duration-500 group ${
                          systemConfig[mod.key] 
                            ? 'bg-white/2 border-white/10 hover:border-blue-500/30' 
                            : 'bg-red-500/5 border-red-500/10 grayscale opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-2xl ${systemConfig[mod.key] ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                              {systemConfig[mod.key] ? mod.icon : <WifiOff className="w-5 h-5" />}
                            </div>
                            <button onClick={() => toggleAccess(mod.key)}>
                              {systemConfig[mod.key] ? <ToggleRight className="w-12 h-12 text-emerald-500" /> : <ToggleLeft className="w-12 h-12 text-slate-700" />}
                            </button>
                        </div>
                        <h4 className={`text-sm font-black uppercase tracking-[0.2em] ${systemConfig[mod.key] ? 'text-white' : 'text-red-400'}`}>{mod.label}</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tight">{mod.desc}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeAdminTab === 'users' && (
            <div className="animate-in fade-in duration-300">
               <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-white/5">
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Identity</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Node_Email</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Status</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {users.map((user, idx) => (
                         <tr key={idx} className="hover:bg-white/2 transition-colors">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xs">
                                     {user.name.charAt(0)}
                                  </div>
                                  <span className="text-sm font-bold text-white uppercase">{user.name}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-xs font-mono text-slate-400">{user.email}</td>
                            <td className="px-8 py-6">
                               <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">Synced</span>
                            </td>
                            <td className="px-8 py-6">
                               <button className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all hover:text-white">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </td>
                         </tr>
                       ))}
                       {users.length === 0 && (
                         <tr>
                            <td colSpan={4} className="px-8 py-20 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">No Identities Indexed</td>
                         </tr>
                       )}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeAdminTab === 'broadcast' && (
            <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="glass-card p-10 rounded-[3rem] border-white/10 space-y-8">
                  <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                     <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600">
                        <Signal className="w-7 h-7" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase text-white tracking-tight">System Broadcast</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Dispatch global alerts to all active Hub nodes.</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 px-2">Alert Priority</label>
                        <div className="flex gap-4">
                           {['info', 'update', 'security'].map(type => (
                             <button 
                                key={type}
                                onClick={() => setBroadcastType(type as any)}
                                className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                  broadcastType === type ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-slate-500'
                                }`}
                             >
                               {type}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 px-2">Message Packet</label>
                        <textarea 
                           value={broadcastMessage}
                           onChange={(e) => setBroadcastMessage(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm font-mono text-white outline-none focus:border-blue-500 min-h-[160px] placeholder:text-slate-800"
                           placeholder="ENTER_BROADCAST_COMMAND..."
                        />
                     </div>

                     <button 
                        disabled={isSending || !broadcastMessage.trim()}
                        onClick={handleSendBroadcast}
                        className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-2xl active:scale-95 disabled:opacity-30"
                     >
                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Dispatch Packet</>}
                     </button>
                  </div>
               </div>

               <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] flex items-center gap-6">
                  <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                     Security Warning: Broadcasts are immutable and stored in public node logs. Unauthorized transmission is logged for Hub audits.
                  </p>
               </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-8 bg-black/60 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">SJL-OS v4.2.0 Build_9012</span>
              </div>
           </div>
           <span className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">Administrative Nexus Core</span>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
