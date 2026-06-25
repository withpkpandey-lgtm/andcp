/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Bug, 
  RefreshCw, 
  AlertTriangle, 
  Sparkles, 
  Terminal, 
  Info, 
  BookOpen, 
  Cpu, 
  Check, 
  Layers, 
  HelpCircle,
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Topic, MessageLineExplanation, PHARMA_PROGRAMS, PharmaProgram } from '../types';

interface CodePlaygroundProps {
  topics: Topic[];
  activeTopicId: string;
  onCodeRunSuccess: (topicId: string) => void;
}

export default function CodePlayground({ topics, activeTopicId, onCodeRunSuccess }: CodePlaygroundProps) {
  const currentTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  
  const [code, setCode] = useState(currentTopic.projectStarterCode || '# Write your Python code here...');
  const [running, setRunning] = useState(false);
  const [debugging, setDebugging] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'project' | 'pharma_library'>('project');

  // Output terminal states
  const [terminalOutput, setTerminalOutput] = useState<string>('Console is ready. Write and run some code! 🐍');
  const [terminalError, setTerminalError] = useState<string>('');
  const [runSummary, setRunSummary] = useState<string>('');
  const [errorLineIndicator, setErrorLineIndicator] = useState<{ lineNo: number; message: string } | null>(null);

  // AI Debugger outcomes
  const [debugResult, setDebugResult] = useState<{
    originalCode: string;
    fixedCode: string;
    issues: string[];
    explanation: string;
  } | null>(null);

  // Line by line outcomes
  const [lineByLineExplanations, setLineByLineExplanations] = useState<MessageLineExplanation[]>([]);
  const [selectedLineIdx, setSelectedLineIdx] = useState<number | null>(null);

  // Load starter code when active topic changes
  useEffect(() => {
    if (activePlaygroundTab === 'project' && currentTopic && currentTopic.projectStarterCode) {
      setCode(currentTopic.projectStarterCode);
      // Reset output states
      setTerminalOutput('Loaded: ' + currentTopic.name + ' project starter code! Try running it. 🚀');
      setTerminalError('');
      setRunSummary('');
      setErrorLineIndicator(null);
      setDebugResult(null);
      setLineByLineExplanations([]);
      setSelectedLineIdx(null);
    }
  }, [activeTopicId, activePlaygroundTab]);

  // Support external loading (e.g. from chatbot "Send to Playground")
  useEffect(() => {
    const handleLoadCode = (e: CustomEvent<string>) => {
      setCode(e.detail);
      setTerminalOutput('Successfully imported code from Pawan Sir! Click "Run Script" to see output. ⚡');
      setTerminalError('');
      setErrorLineIndicator(null);
      setDebugResult(null);
      setLineByLineExplanations([]);
    };
    window.addEventListener('load-code-to-playground' as any, handleLoadCode);
    return () => window.removeEventListener('load-code-to-playground' as any, handleLoadCode);
  }, []);

  // Helper to extract line number from python traceback string
  const extractTracebackLineNumber = (stderr: string, codeStr: string): { lineNo: number; message: string } | null => {
    if (!stderr) return null;
    try {
      // Find pattern like "line 3" or "line 5"
      const match = stderr.match(/line (\d+)/i);
      if (match && match[1]) {
        const lineNo = parseInt(match[1], 10);
        // Find exact error description, usually the last non-empty line
        const errorLines = stderr.trim().split('\n');
        const lastLine = errorLines[errorLines.length - 1] || 'Syntax/Runtime Error';
        return { lineNo, message: lastLine };
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setTerminalOutput('Simulating Python execution... ⚙️');
    setTerminalError('');
    setRunSummary('');
    setErrorLineIndicator(null);

    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      
      if (data.error) {
        setTerminalOutput('');
        setTerminalError(data.error);
      } else {
        setTerminalOutput(data.stdout || 'Code executed successfully with no print output.');
        if (data.stderr) {
          setTerminalError(data.stderr);
          // Auto indicate problem line in editor!
          const problem = extractTracebackLineNumber(data.stderr, code);
          if (problem) {
            setErrorLineIndicator(problem);
          }
        }
        setRunSummary(data.summary || '');
        
        // If code runs successfully (exit code 0), auto-mark project/topic completed!
        if (data.exitCode === 0 && !data.stderr) {
          onCodeRunSuccess(currentTopic.id);
        }
      }
    } catch (err: any) {
      setTerminalError('Failed to execute code: ' + err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleDebugCode = async () => {
    if (!code.trim()) return;
    setDebugging(true);
    setDebugResult(null);

    try {
      const response = await fetch('/api/debug-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (data.error) {
        setTerminalError(data.error);
      } else {
        setDebugResult(data);
      }
    } catch (err: any) {
      setTerminalError('Failed to run AI debugger: ' + err.message);
    } finally {
      setDebugging(false);
    }
  };

  const handleExplainCode = async () => {
    if (!code.trim()) return;
    setExplaining(true);
    setLineByLineExplanations([]);
    setSelectedLineIdx(null);

    try {
      const response = await fetch('/api/explain-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (data.error) {
        setTerminalError(data.error);
      } else {
        setLineByLineExplanations(data.lineByLine || []);
        if (data.lineByLine && data.lineByLine.length > 0) {
          setSelectedLineIdx(0); // auto-select first line
        }
      }
    } catch (err: any) {
      setTerminalError('Failed to explain code: ' + err.message);
    } finally {
      setExplaining(false);
    }
  };

  // Loads a predefined pharmaceutical program from the select dropdown
  const handleSelectPharmaProgram = (prog: PharmaProgram) => {
    setCode(prog.code);
    setTerminalOutput(prog.simulatedOutput);
    setTerminalError('');
    setErrorLineIndicator(null);
    setDebugResult(null);

    // Map predefined explanations so student can view immediately
    const formattedExplanations: MessageLineExplanation[] = prog.explanation.map((exp, idx) => ({
      line: exp.line,
      index: idx,
      explanation: exp.desc
    }));
    setLineByLineExplanations(formattedExplanations);
    setSelectedLineIdx(0);
  };

  const applyFixedCode = () => {
    if (debugResult && debugResult.fixedCode) {
      setCode(debugResult.fixedCode);
      setDebugResult(null);
      setErrorLineIndicator(null);
      setTerminalOutput('Applied Pawan Sir\'s fixed code successfully! Try running it. 💻');
    }
  };

  const loadStarterTemplate = () => {
    if (currentTopic.projectStarterCode) {
      setCode(currentTopic.projectStarterCode);
      setDebugResult(null);
      setErrorLineIndicator(null);
      setLineByLineExplanations([]);
      setSelectedLineIdx(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Redesigned Trendy Workspace Panel Selector */}
      <div className="bg-slate-100 rounded-2xl p-1.5 border border-slate-200/60 shadow-sm flex gap-1">
        <button
          onClick={() => setActivePlaygroundTab('project')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activePlaygroundTab === 'project'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Active Chapter Lab Project
        </button>

        <button
          onClick={() => setActivePlaygroundTab('pharma_library')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activePlaygroundTab === 'pharma_library'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-rose-500 animate-pulse" />
          💊 Pharma Python Library
        </button>
      </div>

      {/* Main Sandbox Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full items-stretch">
        
        {/* Code Editor Column (7/12) */}
        <div className="xl:col-span-7 flex flex-col bg-white rounded-3xl border border-slate-200/70 shadow-lg overflow-hidden h-[620px] transition-all duration-300">
          
          {/* Header */}
          <div className="bg-slate-900 text-slate-300 border-b border-slate-850 px-4.5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 bg-rose-500 rounded-full" />
                <span className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono ml-2">
                {activePlaygroundTab === 'project' ? `${currentTopic.id}_lab.py` : 'pharmaceutical_calculators.py'}
              </span>
            </div>

            {activePlaygroundTab === 'project' && (
              <button
                onClick={loadStarterTemplate}
                className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Code
              </button>
            )}
          </div>

          {/* Project Details Panel or Library Selection dropdown */}
          {activePlaygroundTab === 'project' ? (
            <div className="bg-amber-50/50 border-b border-amber-100 p-4">
              <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Active Chapter Lab Project:
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">
                {currentTopic.projectDescription || 'No project description for this chapter.'}
              </p>
            </div>
          ) : (
            <div className="bg-rose-50/50 border-b border-rose-100 p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Pharmaceutical Python Lab Library:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PHARMA_PROGRAMS.map((prog) => (
                  <button
                    key={prog.id}
                    onClick={() => handleSelectPharmaProgram(prog)}
                    className="p-2.5 text-left border border-slate-200 hover:border-rose-400 bg-white rounded-xl hover:bg-rose-50/30 text-xs font-medium text-slate-700 transition-all shadow-sm flex flex-col cursor-pointer hover:shadow"
                  >
                    <span className="font-bold text-slate-800 truncate">{prog.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{prog.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Line Indication Alert Block */}
          {errorLineIndicator && (
            <div className="bg-rose-50 border-b border-rose-100 px-4 py-2 flex items-center justify-between text-xs text-rose-800 animate-slideDown">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 animate-bounce" />
                <span>
                  <strong>Pawan Sir Warning:</strong> Error detected near <strong>Line {errorLineIndicator.lineNo}</strong>! Check variable declaration or indents.
                </span>
              </div>
              <button 
                onClick={() => setErrorLineIndicator(null)} 
                className="text-[10px] font-bold underline text-rose-600 hover:text-rose-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Editor Area */}
          <div className="flex-1 relative font-mono text-sm">
            <div className="absolute left-0 top-0 bottom-0 w-11 bg-slate-900 border-r border-slate-800 text-slate-500 text-right pr-2.5 select-none font-mono text-[10px] sm:text-xs pt-4 leading-relaxed flex flex-col gap-0.5">
              {code.split('\n').map((_, i) => (
                <div 
                  key={i} 
                  className={`relative ${errorLineIndicator?.lineNo === i + 1 ? 'text-rose-500 font-bold bg-rose-950/40 border-r-2 border-rose-500 pr-1.5' : ''}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errorLineIndicator) setErrorLineIndicator(null);
              }}
              className="w-full h-full pl-14 pr-4 py-4 bg-slate-950 text-slate-100 focus:outline-none resize-none font-mono text-xs sm:text-sm leading-relaxed"
              placeholder="# Write your Python script here...&#10;# Pawan Sir recommends using print() to see output."
              spellCheck="false"
            />
          </div>

          {/* Control bar */}
          <div className="bg-slate-50 border-t border-slate-200/80 px-4 py-3.5 flex gap-2.5 flex-wrap">
            <button
              onClick={handleRunCode}
              disabled={running}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 text-white text-xs font-extrabold rounded-xl hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-indigo-600/10"
            >
              {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              Run Script ⚡
            </button>

            <button
              onClick={handleDebugCode}
              disabled={debugging}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white text-xs font-extrabold rounded-xl hover:bg-black active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-md"
            >
              {debugging ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bug className="w-3.5 h-3.5" />}
              AI Debug Code 🧪
            </button>

            <button
              onClick={handleExplainCode}
              disabled={explaining}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-extrabold rounded-xl hover:bg-indigo-100 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
            >
              {explaining ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
              Line-by-Line Guide
            </button>
          </div>
        </div>

        {/* Console & AI Assistance Column (5/12) */}
        <div className="xl:col-span-5 flex flex-col gap-6 h-[620px]">
          
          {/* Terminal Console */}
          <div className="flex-1 bg-slate-950 text-slate-100 rounded-3xl p-4.5 shadow-xl border border-slate-800/80 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3.5">
              <span className="text-xs font-bold text-slate-400 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                SIMULATED PYTHON CONSOLE
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900/30">
                OUTPUT
              </span>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 whitespace-pre-wrap leading-relaxed">
              {terminalOutput && <p className="text-slate-100">{terminalOutput}</p>}
              {terminalError && (
                <div className="text-rose-400 bg-rose-950/20 p-3 rounded-xl border border-rose-900/40 flex gap-2 mt-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold block mb-1">Standard Error:</span>
                    {terminalError}
                  </div>
                </div>
              )}
              {runSummary && (
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-3 pt-2.5 border-t border-slate-900">
                  ⚡ STATUS SUMMARY: {runSummary}
                </p>
              )}
            </div>
          </div>

          {/* AI Coach Assistant Card */}
          <div className="flex-1 bg-white border border-slate-200/80 shadow-lg rounded-3xl p-4.5 overflow-y-auto min-h-[220px] transition-all duration-300">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-50" />
              Pawan Sir's Lab Guidance
            </h4>

            {/* Empty state */}
            {!debugResult && lineByLineExplanations.length === 0 && (
              <div className="text-center py-10 text-slate-400 space-y-2.5">
                <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">No active breakdown report.</p>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Click "AI Debug Code" or select a Pharmaceutical Program from the library to see Pawan Sir's review.</p>
              </div>
            )}

            {/* AI Debugger Results */}
            {debugResult && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/60 space-y-2">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 animate-pulse" />
                    Bugs Identified ({debugResult.issues.length})
                  </div>
                  <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 font-sans">
                    {debugResult.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor Explanation:</div>
                  <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-150 whitespace-pre-wrap font-sans">
                    {debugResult.explanation}
                  </div>
                </div>

                {debugResult.fixedCode && (
                  <button
                    onClick={applyFixedCode}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 text-white text-xs font-extrabold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Apply Pawan Sir's Fixed Code 🚀
                  </button>
                )}
              </div>
            )}

            {/* Predefined / Pre-mapped Line-by-Line Guide */}
            {lineByLineExplanations.length > 0 && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-[11px] text-slate-500 font-semibold">
                  Select any line below to understand what Mr. Pawan Pandey says about it:
                </p>

                {/* Listing lines */}
                <div className="border border-slate-150 rounded-2xl overflow-hidden font-mono text-xs divide-y divide-slate-100">
                  {lineByLineExplanations.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedLineIdx(idx)}
                      className={`p-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                        selectedLineIdx === idx
                          ? 'bg-indigo-50 text-indigo-900 border-l-4 border-l-indigo-600 font-bold'
                          : 'bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate max-w-[190px]">{item.line || '(blank line)'}</span>
                      <span className="text-[9px] font-sans font-extrabold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full shrink-0">
                        Line {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Selected line explainer */}
                {selectedLineIdx !== null && lineByLineExplanations[selectedLineIdx] && (
                  <div className="bg-indigo-50 border border-indigo-100/80 p-4 rounded-2xl animate-slideUp">
                    <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-100 animate-pulse" />
                      Pawan Sir Line {selectedLineIdx + 1} Guide:
                    </div>
                    <p className="text-xs text-indigo-950 leading-relaxed font-sans font-medium">
                      "{lineByLineExplanations[selectedLineIdx].explanation}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
