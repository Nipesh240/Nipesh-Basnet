
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Terminal, Zap, Activity, Cpu, AlertTriangle, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { generateChatResponse } from '../services/geminiService.ts';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "UPLINK ESTABLISHED: Sajilo Project Hub Strategic Core online. I am optimized for national digital orchestration. How shall we evolve your node today?" }
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
    
    // Add user message to UI immediately
    const currentMessages = [...messages];
    setMessages([...currentMessages, { role: 'user', content: userMsg } as ChatMessage]);
    setIsLoading(true);

    try {
      // History should only contain previous messages
      const history = currentMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const aiResponse = await generateChatResponse(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      setErrorStatus(err.message || "Uplink Failure");
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "SECURITY_NOTICE: Communication channel disrupted. Please verify your network credentials and attempt a manual re-sync. Our core node is active, but your uplink packet was dropped." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[110]">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity animate-pulse" />
          <div className="relative bg-black border border-white/20 p-5 rounded-2xl shadow-2xl transition-all hover:scale-110 flex items-center gap-3">
            <Cpu className="w-6 h-6 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">System Concierge</span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="glass-card rounded-[2.5rem] w-[90vw] sm:w-[450px] h-[650px] flex flex-col border border-white/10 overflow-hidden animate-in slide-in-from-bottom-10 duration-500 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 animate-pulse" />
                <Bot className="relative w-6 h-6 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 whitespace-nowrap">SAJILO HUB AI</span>
                <span className="text-xs font-bold text-white tracking-widest uppercase">Strategic Counsel</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className={`w-1 h-1 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-ping'}`} />
                <span className="text-[8px] font-black text-emerald-500 uppercase">{isLoading ? 'Processing' : 'Active'}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-8 space-y-8 bg-black/40 custom-scrollbar relative"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-2xl flex flex-col gap-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/10 border border-blue-500/30 text-blue-100 rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">
                      {msg.role === 'user' ? 'Local_User' : 'Hub_Core'}
                    </span>
                    <Activity className={`w-3 h-3 opacity-20 ${msg.role === 'user' ? 'text-blue-400' : 'text-slate-400'}`} />
                  </div>
                  <p className="text-sm leading-relaxed font-light">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 animate-in fade-in">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Awaiting Uplink...</span>
                </div>
              </div>
            )}

            {errorStatus && (
              <div className="flex justify-center">
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest">Node Error: {errorStatus}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-white/5 bg-black/60 relative">
            <div className="flex gap-4 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 opacity-50">
                <Terminal className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="INPUT STRATEGIC COMMAND..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-xs font-mono tracking-widest text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-white text-black p-4 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
              >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
