
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  GraduationCap, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen, 
  Search, 
  ArrowLeft,
  Terminal,
  Cpu,
  Zap,
  Building,
  Loader2,
  FileText,
  Sparkles,
  Download,
  Share2
} from 'lucide-react';
import { solveUniversityProject } from '../services/geminiService.ts';

interface UniversityProjectAssistantProps {
  onClose: () => void;
}

const UNIVERSITIES = [
  {
    id: 'tu',
    name: 'Tribhuvan University (TU)',
    faculties: [
      'Institute of Engineering (IOE)',
      'BSc. CSIT',
      'Bachelor in Computer Application (BCA)',
      'BIT & Other IT Streams',
      'Institute of Management',
      'Institute of Science & Technology'
    ]
  },
  {
    id: 'ku',
    name: 'Kathmandu University (KU)',
    faculties: [
      'School of Engineering',
      'School of Science (CS/AI)',
      'School of Management',
      'School of Arts'
    ]
  },
  {
    id: 'pu',
    name: 'Pokhara University (PU)',
    faculties: [
      'Faculty of Science & Technology',
      'Faculty of Management Studies',
      'Faculty of Humanities & Social Sciences'
    ]
  },
  {
    id: 'purbanchal',
    name: 'Purbanchal University',
    faculties: [
      'Faculty of Science & Technology',
      'Faculty of Management'
    ]
  },
  {
    id: 'mwu',
    name: 'Mid-Western University',
    faculties: [
      'Faculty of Engineering',
      'Faculty of Science & Technology'
    ]
  }
];

const UniversityProjectAssistant: React.FC<UniversityProjectAssistantProps> = ({ onClose }) => {
  const [step, setStep] = useState<'uni' | 'faculty' | 'details' | 'synthesis'>('uni');
  const [selectedUni, setSelectedUni] = useState<typeof UNIVERSITIES[0] | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [projectDescription, setProjectDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleUniSelect = (uni: typeof UNIVERSITIES[0]) => {
    setSelectedUni(uni);
    setStep('faculty');
  };

  const handleFacultySelect = (faculty: string) => {
    setSelectedFaculty(faculty);
    setStep('details');
  };

  const handleInitiateSynthesis = async () => {
    if (!projectDescription.trim()) {
      setError("Please provide project details to initiate AI synthesis.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setStep('synthesis');

    try {
      const result = await solveUniversityProject(
        selectedUni?.name || 'Nepali University',
        selectedFaculty || 'Technical Faculty',
        projectDescription
      );
      setAiResult(result);
    } catch (err: any) {
      setError(err.message || "Synthesis Link Interrupted");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiResult, isAnalyzing]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#03040a]/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl glass-card rounded-[3.5rem] border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-inner">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em]">ACADEMIC_OS_v2</span>
              <h3 className="font-heading text-2xl font-black text-white uppercase tracking-tighter">Project Node</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div ref={scrollRef} className="p-10 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {step === 'uni' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Building className="w-4 h-4 text-indigo-500" /> Select University Node
                </h4>
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Lvl_01</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {UNIVERSITIES.map(uni => (
                  <button 
                    key={uni.id}
                    onClick={() => handleUniSelect(uni)}
                    className="flex items-center justify-between p-7 bg-white/2 border border-white/5 rounded-3xl hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group text-left shadow-lg"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-200 group-hover:text-white text-lg tracking-tight">{uni.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-500 transition-transform group-hover:translate-x-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'faculty' && selectedUni && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('uni')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors group">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> System Back
                </button>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{selectedUni.name}</span>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Calibration</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-indigo-500" /> Active Faculties
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedUni.faculties.map(faculty => (
                    <button 
                      key={faculty}
                      onClick={() => handleFacultySelect(faculty)}
                      className="p-6 bg-white/2 border border-white/5 rounded-2xl text-left hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group flex items-center justify-between"
                    >
                      <span className="text-slate-300 group-hover:text-white font-medium text-sm tracking-wide">{faculty}</span>
                      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-indigo-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('faculty')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors group">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Re-calibrate Faculty
                </button>
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] p-8 space-y-8">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                      <Cpu className="w-7 h-7 text-indigo-500" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-white font-black uppercase text-lg tracking-tighter">{selectedFaculty}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{selectedUni?.name}</span>
                   </div>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Input (Project Description)</label>
                    <textarea 
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-indigo-500/50 transition-all min-h-[120px] text-white placeholder:text-slate-800"
                      placeholder="Enter project goals, specific university requirements, or challenges..."
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Link Handle (Phone/Email)</label>
                    <input 
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-800"
                      placeholder="Node Identity..."
                    />
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-[10px] uppercase font-black tracking-widest text-center">{error}</p>}
            </div>
          )}

          {step === 'synthesis' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                   <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                   <h4 className="text-sm font-black uppercase tracking-widest text-white">Project Synthesis Output</h4>
                </div>
                {!isAnalyzing && (
                  <button onClick={() => setStep('details')} className="text-[9px] font-black text-slate-500 uppercase hover:text-indigo-400">Modify Input</button>
                )}
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Analyzing University Format...</span>
                    <span className="text-[9px] font-mono text-slate-600 uppercase">Synchronizing with {selectedUni?.name} standards</span>
                  </div>
                </div>
              ) : aiResult ? (
                <div className="bg-white/2 border border-white/5 rounded-3xl p-8 space-y-8 animate-in slide-up duration-500">
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                    {aiResult}
                  </div>
                  
                  <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                      <Download className="w-4 h-4" /> Download Guide
                    </button>
                    <button className="flex items-center justify-center gap-3 bg-indigo-600/10 border border-indigo-500/20 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-600/20 transition-all">
                      <Share2 className="w-4 h-4" /> Share with Team
                    </button>
                  </div>
                  
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Zap className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-relaxed">
                      Sajilo Core Team is ready to implement this prototype. 
                      <span className="block text-slate-500 font-medium">Mention Ref: SJL-UNI-{Math.floor(Math.random() * 9000) + 1000}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-red-500">
                  <p className="text-sm font-black uppercase">Synthesis Error Occurred</p>
                  <button onClick={handleInitiateSynthesis} className="mt-4 text-[10px] underline">Retry Protocol</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-white/5 bg-white/2">
          {step === 'details' ? (
            <button 
              onClick={handleInitiateSynthesis}
              className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3"
            >
              <Zap className="w-5 h-5 fill-current" /> Initiate AI Synthesis
            </button>
          ) : step === 'synthesis' && !isAnalyzing ? (
            <button 
              onClick={onClose}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              Terminate Session
            </button>
          ) : (
            <p className="text-[9px] font-black text-slate-700 uppercase text-center tracking-[0.4em]">
              Selected Node Routing: {selectedUni ? selectedUni.name : 'Awaiting_Input'}
            </p>
          )}
        </div>
      </div>
      <style>{`
        .prose h1, .prose h2, .prose h3 { color: white; text-transform: uppercase; font-weight: 900; letter-spacing: -0.025em; margin-top: 1.5rem; margin-bottom: 1rem; }
        .prose h3 { font-size: 1.1rem; border-left: 2px solid #6366f1; padding-left: 1rem; }
        .prose p { margin-bottom: 1rem; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default UniversityProjectAssistant;
