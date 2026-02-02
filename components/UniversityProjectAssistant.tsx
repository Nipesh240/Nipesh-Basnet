
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft,
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
import { UserActivity } from '../types.ts';

interface UniversityProjectAssistantProps {
  onClose: () => void;
  addActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
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

const UniversityProjectAssistant: React.FC<UniversityProjectAssistantProps> = ({ onClose, addActivity }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Uni, 2: Faculty, 3: Details, 4: Synthesis
  const [selectedUni, setSelectedUni] = useState<typeof UNIVERSITIES[0] | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [projectTopic, setProjectTopic] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [subjects, setSubjects] = useState('');
  const [year, setYear] = useState('4th Year');
  const [semester, setSemester] = useState('7th Semester');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isBCA = selectedFaculty?.includes('BCA');

  const handleInitiateSynthesis = async () => {
    if (!projectTopic.trim() || !projectDescription.trim()) {
      setError("Topic and Objectives are mandatory for synthesis.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setStep(4);

    try {
      const result = await solveUniversityProject(
        selectedUni?.name || 'Nepali University',
        selectedFaculty || 'Technical Faculty',
        projectTopic,
        projectDescription,
        subjects,
        isBCA ? 'N/A' : year,
        semester
      );
      setAiResult(result);
      addActivity({
        type: 'uni_project',
        title: projectTopic,
        status: 'completed',
        details: `Synthesis report for ${selectedUni?.name}`
      });
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
      
      <div className="relative w-full max-w-2xl bg-[#0a0f1d] border border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-inner">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em]">Step {step} of 4</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Project Node</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div ref={scrollRef} className="p-10 max-h-[55vh] overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-right-4 duration-300">
              {UNIVERSITIES.map(uni => (
                <button 
                  key={uni.id}
                  onClick={() => { setSelectedUni(uni); setStep(2); }}
                  className={`flex items-center justify-between p-7 rounded-3xl transition-all group shadow-lg border ${
                     selectedUni?.id === uni.id ? 'border-indigo-500/40 bg-indigo-500/5' : 'bg-white/2 border-white/5 hover:border-indigo-500/20'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-200 group-hover:text-white text-lg tracking-tight uppercase">{uni.name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-700 group-hover:translate-x-2" />
                </button>
              ))}
            </div>
          )}

          {step === 2 && selectedUni && (
            <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-right-4 duration-300">
              {selectedUni.faculties.map(faculty => (
                <button 
                  key={faculty}
                  onClick={() => { setSelectedFaculty(faculty); setStep(3); }}
                  className={`p-6 rounded-2xl text-left transition-all group flex items-center justify-between shadow-lg border ${
                     selectedFaculty === faculty ? 'border-indigo-500/40 bg-indigo-500/5' : 'bg-white/2 border-white/5 hover:border-indigo-500/20'
                  }`}
                >
                  <span className="text-slate-300 group-hover:text-white font-black uppercase text-xs tracking-widest">{faculty}</span>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-indigo-500" />
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
               {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 text-center">{error}</div>}
               <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] p-10 space-y-8 shadow-inner">
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Project Topic</label>
                    <input 
                      type="text"
                      value={projectTopic}
                      onChange={(e) => setProjectTopic(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-800"
                      placeholder="e.g., AI-based Medical Diagnosis"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    {!isBCA && (
                      <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Year</label>
                        <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-white outline-none cursor-pointer">
                          {YEARS.map(y => <option key={y} value={y} className="bg-[#0a0f1d]">{y}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="flex flex-col gap-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Semester</label>
                      <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-white outline-none cursor-pointer">
                        {SEMESTERS.map(s => <option key={s} value={s} className="bg-[#0a0f1d]">{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Objectives</label>
                    <textarea 
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-indigo-500/50 transition-all min-h-[140px] text-white placeholder:text-slate-800"
                      placeholder="Describe core goals and requirements..."
                    />
                  </div>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 gap-8">
                  <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] animate-pulse text-center">Orchestrating Knowledge Base...</span>
                </div>
              ) : aiResult ? (
                <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl">
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-light leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/30">
                    {aiResult}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-red-500 uppercase font-black text-[10px] tracking-widest">Synthesis Failure</div>
              )}
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="p-10 border-t border-white/5 bg-white/2 flex gap-4">
           {step > 1 && (
             <button 
              disabled={isAnalyzing}
              onClick={() => setStep(prev => (prev - 1) as any)}
              className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-2 active:scale-95"
             >
               <ChevronLeft className="w-4 h-4" /> Go Back
             </button>
           )}
           
           <button 
            disabled={isAnalyzing || (step === 3 && (!projectTopic.trim() || !projectDescription.trim()))}
            onClick={() => {
              if (step < 3) setStep(prev => (prev + 1) as any);
              else if (step === 3) handleInitiateSynthesis();
              else onClose();
            }}
            className={`flex-[2] py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${
              step === 4 ? 'bg-indigo-600 shadow-indigo-500/30 text-white' : 'bg-white text-black'
            } disabled:opacity-30`}
           >
             {isAnalyzing ? (
               <><Loader2 className="w-4 h-4 animate-spin" /> Synthesizing...</>
             ) : (
               <>
                 {step === 4 ? 'Terminate Session' : step === 3 ? 'Initiate Synthesis' : 'Continue'}
                 {step < 3 && <ChevronRight className="w-4 h-4" />}
                 {step === 3 && <Zap className="w-4 h-4" />}
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityProjectAssistant;
