
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Terminal, Zap, Activity, Cpu, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { generateChatResponse } from '../services/geminiService.ts';

interface AIChatProps {
  embedded?: boolean;
}

// Futuristic AI Robot Image
const AI_ROBOT_IMG = "https://images.unsplash.com/photo-1675557009875-436f595b18b8?auto=format&fit=crop&q=80&w=200&h=200";

const AIChat: React.FC<AIChatProps> = ({ embedded = false }) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "UPLINK ESTABLISHED: Sajilo Strategic Core online. I am optimized for national digital orchestration. How shall we evolve your project node today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setErrorStatus(null);
    
    const currentMessages = [...messages];
    setMessages([...currentMessages, { role: 'user', content: userMsg } as ChatMessage]);
    setIsLoading(true);

    try {
      const history = currentMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const aiResponse = await generateChatResponse(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    } catch (err: any) {
      setErrorStatus(err.message || "Uplink Failure");
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "SECURITY_NOTICE: Communication channel disrupted. Our core node is active, but your uplink packet was dropped." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen && !embedded) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 z-[110] relative group flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity animate-pulse" />
        <div className="relative bg-black border border-white/20 p-2 rounded-2xl shadow-2xl transition-all hover:scale-110 flex items-center gap-3 pr-6">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
            <img src={AI_ROBOT_IMG} alt="AI" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Expert Hub</span>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  const containerClasses = embedded 
    ? "h-full w-full flex flex-col bg-black/40 relative overflow-hidden" 
    : "fixed bottom-10 right-10 z-[110] glass-card rounded-[3rem] w-[90vw] sm:w-[480px] h-[700px] flex flex-col border border-white/10 overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-300";

  return (
    <div className={containerClasses}>
      {/* Background Neural Link Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent animate-pulse" />
      </div>

      {!embedded && (
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg">
                <img src={AI_ROBOT_IMG} alt="AI Core" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                <Zap className="w-2 h-2 text-white fill-current" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-500 tracking-[0.4em] uppercase">Core_Strategist</span>
              <h4 className="text-sm font-black text-white uppercase tracking-tighter">Strategic Counsel</h4>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {embedded && (
         <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Sparkles className="w-4 h-4 text-blue-500" />
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Neural Link Status: Active</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Optimized</span>
            </div>
         </div>
      )}

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-10"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl shrink-0 border overflow-hidden ${
                msg.role === 'user' 
                  ? 'bg-blue-600/20 border-blue-500/20' 
                  : 'bg-white/10 border-white/20'
              }`}>
                {msg.role === 'user' ? (
                  <div className="w-full h-full flex items-center justify-center text-blue-400 bg-blue-500/10">
                    <User className="w-5 h-5" />
                  </div>
                ) : (
                  <img src={AI_ROBOT_IMG} alt="AI" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Message Content */}
              <div className={`p-5 rounded-3xl flex flex-col gap-2 ${
                msg.role === 'user' 
                  ? 'bg-blue-600/10 border border-blue-500/30 text-blue-50 rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none shadow-xl'
              }`}>
                <div className="flex items-center justify-between gap-10">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-blue-500' : 'text-slate-600'}`}>
                    {msg.role === 'user' ? 'NODE_UPLINK' : 'SJL_CORE_UNIT'}
                  </span>
                  <span className="text-[7px] font-mono text-slate-800 uppercase">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-xs leading-relaxed font-light whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative overflow-hidden">
                <img src={AI_ROBOT_IMG} alt="Thinking" className="w-full h-full object-cover opacity-40 blur-[1px]" />
                <Loader2 className="w-4 h-4 animate-spin text-blue-500 absolute z-10" />
              </div>
              <div className="bg-white/2 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">Processing Synthesis...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5 bg-black/60 relative z-10 backdrop-blur-xl">
        <div className="flex gap-4 relative">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="INPUT STRATEGIC COMMAND..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[10px] font-mono tracking-widest text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-800 shadow-inner"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-20">
               <Terminal className="w-3.5 h-3.5" />
            </div>
          </div>
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white w-16 h-16 rounded-2xl transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 disabled:opacity-30 flex items-center justify-center shadow-2xl shadow-blue-600/20"
          >
            {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
           <div className="h-[1px] flex-1 bg-white/5" />
           <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">Direct Core Link</span>
           <div className="h-[1px] flex-1 bg-white/5" />
        </div>
      </div>
    </div>
  );
};

export default AIChat;
