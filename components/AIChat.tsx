
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Terminal, Zap, Activity, Cpu, AlertTriangle, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { generateChatResponse } from '../services/geminiService.ts';

interface AIChatProps {
  embedded?: boolean;
}

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
        <div className="relative bg-black border border-white/20 p-5 rounded-2xl shadow-2xl transition-all hover:scale-110 flex items-center gap-3">
          <Cpu className="w-6 h-6 text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Expert Hub</span>
        </div>
      </button>
    );
  }

  const containerClasses = embedded 
    ? "h-full w-full flex flex-col bg-black/20" 
    : "fixed bottom-10 right-10 z-[110] glass-card rounded-[2.5rem] w-[90vw] sm:w-[450px] h-[650px] flex flex-col border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]";

  return (
    <div className={containerClasses}>
      {!embedded && (
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Bot className="w-6 h-6 text-blue-400" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">Expert Strategic Counsel</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] p-4 rounded-2xl flex flex-col gap-2 ${
              msg.role === 'user' 
                ? 'bg-blue-600/10 border border-blue-500/20 text-blue-50 rounded-tr-none' 
                : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
            }`}>
              <span className="text-[7px] font-black uppercase tracking-widest opacity-30">
                {msg.role === 'user' ? 'UPLINK_USER' : 'CORE_ENGINE'}
              </span>
              <p className="text-xs leading-relaxed font-light">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
              <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
              <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Synthesizing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/5 bg-black/40">
        <div className="flex gap-3 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="SYSTEM COMMAND..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-[10px] font-mono tracking-widest text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-4 rounded-xl transition-all hover:bg-blue-500 disabled:opacity-30"
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
