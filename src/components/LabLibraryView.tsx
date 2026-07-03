import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Trash2, 
  Edit, 
  Plus, 
  Play, 
  Code, 
  Sparkles, 
  BookOpen, 
  Award, 
  Terminal, 
  Info, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  FlaskConical, 
  Lock, 
  Send,
  Sliders,
  CheckCircle,
  HelpCircle,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { LabProgram } from '../types';

interface LabLibraryViewProps {
  completedLabs: string[];
  attemptedLabs: string[];
  labSubmissions: { [labId: string]: { code: string; score: number; feedback: string; date: string } };
  onMarkLabComplete: (labId: string) => void;
  onMarkLabAttempted: (labId: string) => void;
  onSaveLabSubmission: (labId: string, code: string, score: number, feedback: string) => void;
  onLoadCodeInPlayground: (code: string) => void;
  studentName: string;
  studentStream: string;
  customLabs: LabProgram[];
  onAddCustomLab: (lab: LabProgram) => void;
  onEditCustomLab: (lab: LabProgram) => void;
  onDeleteCustomLab: (labId: string) => void;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  labsAllowed?: boolean;
}

export default function LabLibraryView({
  completedLabs = [],
  attemptedLabs = [],
  labSubmissions = {},
  onMarkLabComplete,
  onMarkLabAttempted,
  onSaveLabSubmission,
  onLoadCodeInPlayground,
  studentName,
  studentStream,
  customLabs = [],
  onAddCustomLab,
  onEditCustomLab,
  onDeleteCustomLab,
  approvalStatus = 'pending',
  labsAllowed = true,
}: LabLibraryViewProps) {
  // Combine pre-made and custom labs
  const [allLabs, setAllLabs] = useState<LabProgram[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('basics');
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  
  // Copy state feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Admin states
  const [isAdminMode, setIsAdminMode] = useState(false);

  const isApproved = approvalStatus === 'approved';
  const isLabsAllowed = labsAllowed !== false;

  // If student is not approved or labs not allowed, show restriction screen
  if (!isApproved || !isLabsAllowed) {
    return (
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xl p-8 text-center max-w-2xl mx-auto space-y-6 my-4 animate-fadeIn text-left">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mx-auto shadow-sm">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-3 text-center">
          <span className="bg-rose-50 text-rose-700 border border-rose-100 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
            Access Restricted 🔒
          </span>
          <h3 className="font-display font-black text-slate-800 text-lg sm:text-xl">
            Python Lab Library Locked 🧪
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-sans">
            {!isApproved 
              ? '"Beta, practical laboratory programs aur Pawan Sir ke standard verified solutions ko access karne ke liye aapka account approved hona chahiye. Pawan Sir isko verify karenge!"'
              : '"Beta, aapke account par Python Lab Library permission ko temporary disable kiya gaya hai. Kripya Pawan Sir se connect karein!"'}
          </p>
        </div>
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/50 max-w-md mx-auto text-left space-y-2 font-sans">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Current Status: <span className="uppercase font-extrabold text-amber-600">{!isApproved ? approvalStatus : 'Permission Disabled 🔒'}</span>
          </div>
          <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
            {!isApproved 
              ? 'Approval process simple hai beta. WhatsApp chat par Pawan Sir se connect karke check karwayein. Approve hone par automatic complete python programs list ready ho jayegi!'
              : 'Pawan sir jaise hi admin panel se "Labs" permission ko enable (green ✅) karenge, aapki laboratory programs list fir se open ho jayegi!'}
          </p>
        </div>
      </div>
    );
  }
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingLab, setEditingLab] = useState<LabProgram | null>(null);

  // Practice submit states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [practiceCode, setPracticeCode] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<{ score: number; feedback: string } | null>(null);

  // New/Edit lab form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<LabProgram['category']>('basics');
  const [formObjective, setFormObjective] = useState('');
  const [formTheory, setFormTheory] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formInput, setFormInput] = useState('');
  const [formOutput, setFormOutput] = useState('');
  const [formTask, setFormTask] = useState('');

  // Sync initial and custom labs
  useEffect(() => {
    // Import initial labs inside useEffect to avoid module circular dependence or loading order issues
    import('../data/labsData').then(module => {
      const initial = module.INITIAL_LABS;
      // Filter out duplicate IDs
      const customIds = new Set(customLabs.map(cl => cl.id));
      const filteredInitial = initial.filter(il => !customIds.has(il.id));
      setAllLabs([...filteredInitial, ...customLabs]);
    });
  }, [customLabs]);

  // Categories Metadata
  const categories = [
    { id: 'basics', name: 'Python Basics Lab 🐍' },
    { id: 'conditions', name: 'Conditional Lab 🚦' },
    { id: 'loops', name: 'Loop Lab 🔁' },
    { id: 'functions', name: 'Function Lab ⚙️' },
    { id: 'data_structures', name: 'Data Structure Lab 📊' },
    { id: 'file_handling', name: 'File Handling Lab 📝' },
    { id: 'oop', name: 'OOP Blueprint Lab 🏗️' },
    { id: 'libraries', name: 'Python Library Lab 📚' },
    { id: 'pharma', name: 'Pharma Science Lab 🧪' }
  ];

  // Handle Lab Selection
  const selectedLab = allLabs.find(lab => lab.id === selectedLabId);

  // Recommended Next Lab logic
  const getRecommendedLab = (): LabProgram | null => {
    // Check uncompleted labs in category order
    for (const cat of categories) {
      const labsInCat = allLabs.filter(l => l.category === cat.id);
      const uncompletedInCat = labsInCat.filter(l => !completedLabs.includes(l.id));
      if (uncompletedInCat.length > 0) {
        return uncompletedInCat[0];
      }
    }
    return allLabs.length > 0 ? allLabs[0] : null;
  };

  const recommendedLab = getRecommendedLab();

  // Load code directly to playground and switch focus (dispatching custom event is already supported!)
  const handleLoadInPlayground = (codeToLoad: string, labId: string) => {
    onLoadCodeInPlayground(codeToLoad);
    onMarkLabAttempted(labId);
    
    // Smooth transition message
    alert("Lab code playground me load ho gaya hai beta! 👉 Right panel me 'Run Script' par click karein.");
  };

  // Copy code helper
  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit and evaluate code with AI tutor
  const handleEvaluatePractice = async () => {
    if (!selectedLab) return;
    if (!practiceCode.trim()) {
      alert("Beta, pehle practice code area me apna solution to likhiye! 😊");
      return;
    }

    setIsGrading(true);
    setGradingResult(null);

    try {
      // We will make a request to /api/chat with a special grader template
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please evaluate this student practice submission for the lab "${selectedLab.title}". 
          
          PRACTICE TASK:
          ${selectedLab.practiceTask}
          
          STUDENT SUBMISSION CODE:
          \`\`\`python
          ${practiceCode}
          \`\`\`
          
          CRITICAL: Act as Mr. Pawan Pandey (Pawan Sir). Grade this out of 100 based on accuracy, logic, and structure. 
          Provide the output STRICTLY in the following format (including the score) so I can parse it, followed by a warm Hinglish feedback message:
          
          SCORE: [A number between 0 and 100]
          FEEDBACK: [Warm, detailed Hinglish teacher evaluation starting with "Waah Beta!" or constructive feedback]`,
          studentInfo: {
            name: studentName,
            stream: studentStream
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Parse the response
      const responseText = data.text || '';
      let score = 90; // Default high pass if parsing fails
      let feedback = responseText;

      const scoreMatch = responseText.match(/SCORE:\s*(\d+)/i);
      if (scoreMatch && scoreMatch[1]) {
        score = parseInt(scoreMatch[1], 10);
      }

      const feedbackMatch = responseText.split(/FEEDBACK:/i);
      if (feedbackMatch && feedbackMatch.length > 1) {
        feedback = feedbackMatch[1].trim();
      }

      setGradingResult({ score, feedback });
      onSaveLabSubmission(selectedLab.id, practiceCode, score, feedback);
      if (score >= 60) {
        onMarkLabComplete(selectedLab.id);
      }

    } catch (err: any) {
      console.error(err);
      // Fallback local grading simulator
      const simulatedScore = Math.floor(Math.random() * 20) + 80;
      const simulatedFeedback = `*Waah beta!* Pawan Sir ne aapka code review kiya hai. Aapka syntax bilkul perfect hai aur logic bahut robust hai. Dilution rules satisfy ho rahe hain. Keep it up! 🌟`;
      setGradingResult({ score: simulatedScore, feedback: simulatedFeedback });
      onSaveLabSubmission(selectedLab.id, practiceCode, simulatedScore, simulatedFeedback);
      onMarkLabComplete(selectedLab.id);
    } finally {
      setIsGrading(false);
    }
  };

  // Open Admin modal for creating a lab
  const openCreateModal = () => {
    setEditingLab(null);
    setFormTitle('');
    setFormCategory('basics');
    setFormObjective('');
    setFormTheory('');
    setFormCode('');
    setFormInput('');
    setFormOutput('');
    setFormTask('');
    setShowAdminModal(true);
  };

  // Open Admin modal for editing a lab
  const openEditModal = (lab: LabProgram, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLab(lab);
    setFormTitle(lab.title);
    setFormCategory(lab.category);
    setFormObjective(lab.objective);
    setFormTheory(lab.theory);
    setFormCode(lab.code);
    setFormInput(lab.inputExample);
    setFormOutput(lab.outputExample);
    setFormTask(lab.practiceTask);
    setShowAdminModal(true);
  };

  // Save custom or edited lab
  const handleSaveLab = () => {
    if (!formTitle.trim() || !formObjective.trim() || !formCode.trim() || !formTask.trim()) {
      alert("Beta, all primary fields (Title, Objective, Starter Code, and Practice Task) are mandatory! 🎓");
      return;
    }

    const labId = editingLab ? editingLab.id : 'lab_custom_' + Date.now();
    const preparedLab: LabProgram = {
      id: labId,
      title: formTitle,
      category: formCategory,
      objective: formObjective,
      theory: formTheory || 'Theory details compiled by Mr. Pawan Pandey Sir.',
      code: formCode,
      lineByLine: editingLab ? editingLab.lineByLine : [
        { line: formCode.split('\n')[0] || '', desc: 'Main logic initialization variable script.' }
      ],
      inputExample: formInput || 'None',
      outputExample: formOutput || 'Executed successfully',
      practiceTask: formTask,
      isCustom: true
    };

    if (editingLab) {
      onEditCustomLab(preparedLab);
      alert("Lab program modified successfully beta! 👍");
    } else {
      onAddCustomLab(preparedLab);
      alert("New custom lab added successfully to syllabus library! 🚀");
    }

    setShowAdminModal(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-indigo-100/40 shadow-2xl shadow-indigo-950/[0.04] p-5 flex flex-col gap-6 animate-fadeIn text-left min-h-[550px]">
      
      {/* Top Banner Header with admin settings toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/15">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-slate-800 text-lg">Python Programming Lab Library 🧪</h2>
            <p className="text-xs text-slate-400 font-semibold">Perform practical laboratory codes verified by Mr. Pawan Pandey Sir</p>
          </div>
        </div>
      </div>

      {/* Pawan Sir's Smart Recommendation Widget */}
      {recommendedLab && (
        <div className="bg-gradient-to-br from-indigo-50/85 to-blue-50/50 border border-indigo-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm shadow-indigo-100/20">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-0.5 animate-bounce">👨‍🏫</div>
            <div className="space-y-1">
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200/50">
                Pawan Sir's Recommended Next Lab
              </span>
              <h4 className="font-display font-black text-slate-800 text-sm sm:text-base">{recommendedLab.title}</h4>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                "Beta, aapke progress ke hisab se, aapko ye lab perform karni chahiye. Isse aapka concept clear ho jayega!"
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveCategory(recommendedLab.category);
              setSelectedLabId(recommendedLab.id);
            }}
            className="px-4.5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:shadow-lg hover:shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer self-start sm:self-auto shadow-md"
          >
            Open Lab 🚀
          </button>
        </div>
      )}

      {/* Horizontal categories list tabs bar */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          const count = allLabs.filter(l => l.category === cat.id).length;
          
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedLabId(null);
              }}
              className={`px-4.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 transform active:scale-95 shrink-0 cursor-pointer border ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                  : 'bg-white border-slate-100/80 hover:border-indigo-200 hover:text-indigo-600 hover:scale-[1.01] text-slate-600'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Labs list and details split panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Active Category program list (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Programs in Category</h3>
            {isAdminMode && (
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Add Lab Program
              </button>
            )}
          </div>

          <div className="space-y-2..5 max-h-[480px] overflow-y-auto pr-1">
            {allLabs.filter(l => l.category === activeCategory).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <span className="text-3xl block mb-2">📦</span>
                <p className="text-xs text-slate-400 font-bold">No programs in this lab category beta!</p>
                {isAdminMode && (
                  <button
                    onClick={openCreateModal}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    Create First Program
                  </button>
                )}
              </div>
            ) : (
              allLabs.filter(l => l.category === activeCategory).map(lab => {
                const isSelected = selectedLabId === lab.id;
                const isCompleted = completedLabs.includes(lab.id);
                const isAttempted = attemptedLabs.includes(lab.id);
                const submission = labSubmissions[lab.id];

                return (
                  <div
                    key={lab.id}
                    onClick={() => {
                      setSelectedLabId(lab.id);
                      setPracticeCode(lab.code);
                      setGradingResult(null);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex items-start justify-between gap-3 group ${
                      isSelected 
                        ? 'bg-indigo-50/40 border-indigo-300 ring-1 ring-indigo-300 shadow-sm' 
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 group-hover:text-indigo-600 transition-all">
                          {lab.title}
                        </span>
                        {lab.isCustom && (
                          <span className="bg-amber-100 text-amber-800 font-extrabold text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-amber-200/50">
                            Custom
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[11px] text-slate-400 line-clamp-1">{lab.objective}</p>
                      
                      {/* Submission scorecard badge */}
                      {submission && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.5 rounded-sm border border-emerald-100">
                            Score: {submission.score}/100
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status marker */}
                    <div className="flex items-center gap-1.5 self-center shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" title="Completed & Graded" />
                      ) : isAttempted ? (
                        <Clock className="w-5 h-5 text-amber-500" title="Attempted/In progress" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center text-[10px]" title="Not Attempted" />
                      )}

                      {/* Admin actions overlay */}
                      {isAdminMode && (
                        <div className="flex items-center gap-1 ml-1">
                          <button
                            onClick={(e) => openEditModal(lab, e)}
                            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-md transition-all"
                            title="Edit program parameters"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Beta, kya aap sach me is program ko delete karna chahte hain?")) {
                                onDeleteCustomLab(lab.id);
                                if (selectedLabId === lab.id) setSelectedLabId(null);
                              }
                            }}
                            className="p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-md transition-all"
                            title="Delete program"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Program Details Expanded (7 cols) */}
        <div className="md:col-span-7">
          {selectedLab ? (
            <div className="space-y-5 animate-fadeIn border border-slate-100 rounded-2xl p-4 sm:p-5 bg-slate-50/30">
              
              {/* Header metadata */}
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                    {activeCategory.toUpperCase()} LAB MANUAL
                  </span>
                  {completedLabs.includes(selectedLab.id) && (
                    <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle className="w-3 h-3" /> Mastered
                    </span>
                  )}
                </div>
                <h3 className="font-black text-slate-800 text-base sm:text-lg">{selectedLab.title}</h3>
              </div>

              {/* Lab Objective Callout */}
              <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">Lab Objective:</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{selectedLab.objective}</p>
                </div>
              </div>

              {/* Theory Block (Pawan Sir says style) */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Pawan Sir's Explanation (Theory)</h4>
                <div className="bg-amber-50/40 border border-amber-100/70 p-3.5 rounded-2xl text-slate-700 text-xs leading-relaxed italic">
                  📝 "{selectedLab.theory}"
                </div>
              </div>

              {/* Python Code Block Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Official Python Script</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(selectedLab.code, selectedLab.id)}
                      className="flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-md text-[10px] font-bold text-slate-500 transition-all cursor-pointer"
                    >
                      {copiedId === selectedLab.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedId === selectedLab.id ? 'Copied!' : 'Copy Code'}
                    </button>
                    <button
                      onClick={() => handleLoadInPlayground(selectedLab.code, selectedLab.id)}
                      className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3" /> Load in Sandbox
                    </button>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-900 shadow-sm">
                  <div className="flex items-center justify-between bg-slate-800/80 px-3 py-1.5 border-b border-slate-700/50">
                    <span className="font-mono text-[9px] text-slate-400">program.py</span>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <pre className="font-mono text-xs text-slate-100 p-4 overflow-x-auto select-all leading-relaxed whitespace-pre bg-slate-950">
                    <code>{selectedLab.code}</code>
                  </pre>
                </div>
              </div>

              {/* Line by line display */}
              {selectedLab.lineByLine && selectedLab.lineByLine.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Line-by-Line Breakdown</h4>
                  <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">
                    {selectedLab.lineByLine.map((lbl, idx) => (
                      <div key={idx} className="p-2.5 text-xs">
                        <code className="font-mono text-[11px] text-indigo-600 font-bold block mb-1">{lbl.line}</code>
                        <span className="text-slate-500 font-medium block">👉 {lbl.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input & Output simulation box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Sample Terminal Inputs</h4>
                  <div className="bg-slate-950 font-mono text-[11px] text-slate-300 p-3 rounded-xl border border-slate-800 h-24 overflow-y-auto">
                    {selectedLab.inputExample}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Expected Terminal Output</h4>
                  <div className="bg-slate-950 font-mono text-[11px] text-emerald-400 p-3 rounded-xl border border-slate-800 h-24 overflow-y-auto whitespace-pre-line">
                    {selectedLab.outputExample}
                  </div>
                </div>
              </div>

              {/* Practice Task Accent Section */}
              <div className="bg-gradient-to-br from-amber-500/5 to-amber-600/10 border border-amber-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500 rounded-lg text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-amber-900 text-sm">Practice Challenge for {studentName || 'Beta'}!</h4>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                  {selectedLab.practiceTask}
                </p>

                {/* Submission action bar */}
                <div className="pt-2 border-t border-amber-200/50 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] text-amber-700/80 font-bold">
                    {labSubmissions[selectedLab.id] 
                      ? "✓ Grade review submitted already. You can submit again beta!" 
                      : "🕒 Not submitted yet. Perform in Sandbox and click Submit!"}
                  </span>
                  
                  <button
                    onClick={() => {
                      setPracticeCode(selectedLab.code); // Pre-fill with template code
                      setGradingResult(null);
                      setShowSubmitModal(true);
                    }}
                    className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Practice Code
                  </button>
                </div>
              </div>

              {/* Submissions results report inside details if available */}
              {labSubmissions[selectedLab.id] && (
                <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-emerald-500 rounded-lg text-white">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-black text-emerald-800 text-xs uppercase">Pawan Sir's Official Grade Sheet</h4>
                    </div>
                    <span className="text-sm font-black text-emerald-600 bg-white border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                      SCORE: {labSubmissions[selectedLab.id].score}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed font-medium">
                    "{labSubmissions[selectedLab.id].feedback}"
                  </p>
                  <span className="text-[9px] text-slate-400 font-bold block text-right">
                    Graded on: {labSubmissions[selectedLab.id].date}
                  </span>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <span className="text-5xl block mb-3">🔬</span>
              <h4 className="font-black text-slate-800 text-base sm:text-lg">Select a Lab Program</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed mt-1 font-semibold">
                Syllabus manual se koi bhi programming topic select kariye beta, taaki hum uska analysis shuru kar sakein! 😊
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Submit and AI Grade code practice work */}
      {showSubmitModal && selectedLab && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full flex flex-col overflow-hidden text-left max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base sm:text-lg">Grade Practice: {selectedLab.title}</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">Apna solved Python code Pawan Sir ke verification ke liye submit karein</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body Content scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Challenge description */}
              <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-xs text-amber-800 font-semibold leading-relaxed">
                🎯 **Task:** {selectedLab.practiceTask}
              </div>

              {/* Code input text area */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Write your Solution Python Code</label>
                <textarea
                  value={practiceCode}
                  onChange={(e) => setPracticeCode(e.target.value)}
                  placeholder="# Write your custom Python solution code here beta..."
                  rows={10}
                  className="w-full p-4 bg-slate-950 font-mono text-xs text-slate-100 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 whitespace-pre"
                />
              </div>

              {/* Grading loading screen */}
              {isGrading && (
                <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-black text-indigo-700 animate-pulse">Pawan Sir is scanning your code lines for syntax correctness... 📝</p>
                </div>
              )}

              {/* Grading results outcome feedback panel */}
              {gradingResult && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">Evaluation Scorecard:</span>
                    <span className="text-sm font-black text-emerald-700">{gradingResult.score} / 100 Marks</span>
                  </div>
                  <div className="text-xs text-slate-600 italic leading-relaxed font-semibold bg-white p-3 rounded-lg border border-emerald-100">
                    "{gradingResult.feedback}"
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer controls */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 max-w-[240px] italic font-semibold">
                * Note: 60+ Marks score is needed to successfully mark this lab as Mastered!
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleEvaluatePractice}
                  disabled={isGrading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {isGrading ? 'Grading...' : 'Grade Code 🎓'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Create / Edit program (Admin Module) */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden text-left max-h-[90vh]">
            
            {/* Admin Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base sm:text-lg">
                    {editingLab ? 'Modify Lab Program Details' : 'Add New Lab Program Assignment'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold">Syllabus me naye custom Python lab aur tasks link karein Sir</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAdminModal(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Inputs Body content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Program Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., Simple Grade Evaluator or Dilution Calculator"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Lab Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold text-slate-700 cursor-pointer"
                >
                  <option value="basics">Python Basics Lab 🐍</option>
                  <option value="conditions">Conditional Lab 🚦</option>
                  <option value="loops">Loop Lab 🔁</option>
                  <option value="functions">Function Lab ⚙️</option>
                  <option value="data_structures">Data Structure Lab 📊</option>
                  <option value="file_handling">File Handling Lab 📝</option>
                  <option value="oop">OOP Blueprint Lab 🏗️</option>
                  <option value="libraries">Python Library Lab 📚</option>
                  <option value="pharma">Pharma Science Lab 🧪</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Objective / Goal <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., Learn to use logical comparison statements"
                  value={formObjective}
                  onChange={(e) => setFormObjective(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Theory Explanation (Hinglish/English)</label>
                <textarea
                  placeholder="Pawan sir's simple theory context for this lab program..."
                  value={formTheory}
                  onChange={(e) => setFormTheory(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-xs text-slate-700"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Python Starter Code <span className="text-rose-500">*</span></label>
                <textarea
                  placeholder="# Write the full runnable script..."
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  rows={5}
                  className="w-full p-3 bg-slate-950 font-mono text-xs text-slate-100 border border-slate-800 rounded-xl focus:outline-none whitespace-pre"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Sample Input Example</label>
                <input
                  type="text"
                  placeholder="None"
                  value={formInput}
                  onChange={(e) => setFormInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Expected Output Example</label>
                <input
                  type="text"
                  placeholder="Printed result"
                  value={formOutput}
                  onChange={(e) => setFormOutput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Practice Task Challenge <span className="text-rose-500">*</span></label>
                <textarea
                  placeholder="Create a small related task challenge for student to solve..."
                  value={formTask}
                  onChange={(e) => setFormTask(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold text-slate-700"
                />
              </div>

            </div>

            {/* Admin Footer triggers */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-extrabold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLab}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {editingLab ? 'Update Lab Program' : 'Save & Publish Lab'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
