
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
  Share2,
  Hash,
  Tags,
  Calendar,
  Layers
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

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SEMESTERS = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];

const UniversityProjectAssistant: React.FC<UniversityProjectAssistantProps> = ({ onClose }) => {
  const [step, setStep] = useState<'uni' | 'faculty' | 'details' | 'synthesis'>('uni');
  const [selectedUni, setSelectedUni] = useState<typeof UNIVERSITIES[0] | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [projectTopic, setProjectTopic] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [subjects, setSubjects] = useState('');
  const [year, setYear] = useState('4th Year');
  const [semester, setSemester] = useState('7th Semester');
  const [contactInfo, setContactInfo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if current faculty is BCA
  const isBCA = selectedFaculty?.includes('BCA');

  const handleUniSelect = (uni: typeof UNIVERSITIES[0]) => {
    setSelectedUni(uni);
    setStep('faculty');
  };

  const handleFacultySelect = (faculty: string) => {
    setSelectedFaculty(faculty);
    setStep('details');
  };

  const handleInitiateSynthesis = async () => {
    if (!projectTopic.trim() || !projectDescription.trim()) {
      setError("Please provide a topic and description to initiate AI synthesis.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setStep('synthesis');

    try {
      const result = await solveUniversityProject(
        selectedUni?.name || 'Nepali University',
        selectedFaculty || 'Technical Faculty',
        projectTopic,
        projectDescription,
        subjects,
        isBCA ? 'N/A (BCA Degree Track)' : year,
        semester
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
              <div className="flex items-center justify-between px-2">
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
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 px-2">
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
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between px-2">
                <button onClick={() => setStep('faculty')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors group">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Re-calibrate Faculty
                </button>
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] p-10 space-y-10 shadow-inner">
                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                   <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-lg">
                      <Cpu className="w-8 h-8 text-indigo-500" />
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="text-white font-black uppercase text-xl tracking-tighter">{selectedFaculty}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{selectedUni?.name}</span>
                   </div>
                </div>

                <div className="space-y-10">
                  {/* PROJECT TOPIC */}
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                      <Hash className="w-3.5 h-3.5 text-indigo-500" /> Project Topic
                    </label>
                    <input 
                      type="text"
                      value={projectTopic}
                      onChange={(e) => setProjectTopic(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-800 shadow-xl"
                      placeholder="e.g., AI-based Traffic Management System"
                    />
                  </div>

                  {/* YEAR AND SEMESTER SELECTION WITH INCREASED SPACE */}
                  <div className={`grid ${isBCA ? 'grid-cols-1' : 'grid-cols-2'} gap-8`}>
                    {!isBCA && (
                      <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Academic Year
                        </label>
                        <select 
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:border-indigo-500/50 transition-all text-white appearance-none cursor-pointer shadow-xl"
                        >
                          {YEARS.map(y => <option key={y} value={y} className="bg-[#111827]">{y}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="flex flex-col gap-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" /> Semester Cycle
                      </label>
                      <select 
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:border-indigo-500/50 transition-all text-white appearance-none cursor-pointer shadow-xl"
                      >
                        {SEMESTERS.map(s => <option key={s} value={s} className="bg-[#111827]">{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* PROJECT DESCRIPTION */}
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" /> Project Objectives
                    </label>
                    <textarea 
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-indigo-500/50 transition-all min-h-[160px] text-white placeholder:text-slate-800 shadow-xl leading-relaxed"
                      placeholder="Enter core goals, specific requirements, or technical challenges..."
                    />
                  </div>
                  
                  {/* RELEVANT SUBJECTS */}
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                      <Tags className="w-3.5 h-3.5 text-indigo-500" /> Relevant Coursework
                    </label>
                    <input 
                      type="text"
                      value={subjects}
                      onChange={(e) => setSubjects(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-800 shadow-xl"
                      placeholder="e.g., Computer Networks, Database, AI, etc."
                    />
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-[10px] uppercase font-black tracking-[0.4em] text-center px-4">{error}</p>}
            </div>
          )}

          {step === 'synthesis' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/5 pb-8 px-2">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-indigo-500/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                   </div>
                   <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white">Academic Memorandum</h4>
                </div>
                {!isAnalyzing && (
                  <button onClick={() => setStep('details')} className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 border-b border-transparent hover:border-indigo-500 transition-all">Revise Parameters</button>
                )}
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 animate-pulse" />
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] animate-pulse">Orchestrating Knowledge Base...</span>
                    <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Applying {selectedUni?.name} Logic Gates</span>
                  </div>
                </div>
              ) : aiResult ? (
                <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-10 space-y-10 animate-in slide-up duration-500 shadow-2xl">
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-light leading-[1.8] whitespace-pre-wrap selection:bg-indigo-500/30">
                    {aiResult}
                  </div>
                  
                  <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-6">
                    <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-lg active:scale-95">
                      <Download className="w-4 h-4" /> Download Node
                    </button>
                    <button className="flex items-center justify-center gap-3 bg-indigo-600/10 border border-indigo-500/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 hover:bg-indigo-600/20 transition-all shadow-lg active:scale-95">
                      <Share2 className="w-4 h-4" /> Export Synthesis
                    </button>
                  </div>
                  
                  <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex items-center gap-8 shadow-inner">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 shadow-lg border border-emerald-500/20">
                      <Zap className="w-7 h-7" />
                    </div>
                    <div className="text-left space-y-1">
                      <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] leading-relaxed">
                        Sajilo Engineering Corps is ready for implementation. 
                      </p>
                      <span className="block text-slate-500 font-medium text-[9px] uppercase tracking-widest">Protocol ID: SJL-UNI-{Math.floor(Math.random() * 9000) + 1000}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-red-500">
                  <p className="text-sm font-black uppercase tracking-widest">Synthesis Link Failed</p>
                  <button onClick={handleInitiateSynthesis} className="mt-4 text-[10px] font-black underline uppercase tracking-widest">Retry Uplink</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-10 border-t border-white/5 bg-white/2">
          {step === 'details' ? (
            <button 
              onClick={handleInitiateSynthesis}
              className="w-full bg-indigo-600 py-6 rounded-2xl font-black uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 flex items-center justify-center gap-4 text-white"
            >
              <Zap className="w-5 h-5 fill-current" /> INITIATE_AI_SYNTHESIS
            </button>
          ) : step === 'synthesis' && !isAnalyzing ? (
            <button 
              onClick={onClose}
              className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              TERMINATE_SESSION
            </button>
          ) : (
            <div className="flex items-center justify-center gap-4 opacity-40">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[9px] font-black text-slate-500 uppercase text-center tracking-[0.5em]">
                NODE_ROUTING: {selectedUni ? selectedUni.name : 'AWAITING_CALIBRATION'}
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .prose h1 { font-size: 1.5rem; color: #6366f1; border-bottom: 2px solid rgba(99, 102, 241, 0.2); padding-bottom: 0.5rem; margin-bottom: 2rem; }
        .prose h2, .prose h3 { color: white; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em; margin-top: 2rem; margin-bottom: 1rem; }
        .prose h2 { font-size: 1.1rem; border-left: 3px solid #6366f1; padding-left: 1.2rem; }
        .prose p { margin-bottom: 1.2rem; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default UniversityProjectAssistant;
