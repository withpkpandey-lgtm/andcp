/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  Flame, 
  Star, 
  Trophy, 
  Printer, 
  ArrowRight, 
  BookOpen, 
  User, 
  Bookmark, 
  Layers, 
  Edit3, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { StudentProgress, Topic } from '../types';

interface ProgressCardProps {
  progress: StudentProgress;
  topics: Topic[];
  onUpdateProfile: (name: string, roll: string, stream: 'B.pharm' | 'D.pharm' | '') => void;
  onNavigateToTopic: (topicId: string) => void;
}

export default function ProgressCard({ progress, topics, onUpdateProfile, onNavigateToTopic }: ProgressCardProps) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(progress.userName);
  const [tempRoll, setTempRoll] = useState(progress.rollNumber || '');
  const [tempStream, setTempStream] = useState<'B.pharm' | 'D.pharm' | ''>(progress.stream || 'B.pharm');

  const totalTopics = topics.length;
  const completedCount = progress.completedTopics.length;
  const percentComplete = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Calculate stats
  const totalQuizzesAttempted = Object.keys(progress.quizScores).length;
  const averageQuizScore = totalQuizzesAttempted > 0 
    ? Math.round(
        (Object.values(progress.quizScores).reduce((acc, q) => acc + (q.score / q.total), 0) / totalQuizzesAttempted) * 100
      )
    : 0;

  const handleSaveProfile = () => {
    if (tempName.trim()) {
      onUpdateProfile(tempName.trim(), tempRoll.trim(), tempStream);
      setEditing(false);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const isCompleted = percentComplete === 100;

  return (
    <div id="progress-card-container" className="space-y-6">
      
      {/* Redesigned Profile block with fully-functional Roll and Stream Editor */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/60 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md">
              {progress.userName ? progress.userName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-800 text-lg">{progress.userName}</h3>
                {progress.stream && (
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {progress.stream}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Roll No: {progress.rollNumber || 'Not specified'}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Joined: {progress.joinedDate}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setTempName(progress.userName);
              setTempRoll(progress.rollNumber || '');
              setTempStream(progress.stream || 'B.pharm');
              setEditing(!editing);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Student Details
          </button>
        </div>

        {/* Editing details settings panel */}
        {editing ? (
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/40 grid grid-cols-1 md:grid-cols-3 gap-4.5 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 block">Student Full Name</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold text-slate-800"
                placeholder="Name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 block">Roll Number</label>
              <input
                type="text"
                value={tempRoll}
                onChange={(e) => setTempRoll(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono text-slate-700 font-semibold"
                placeholder="e.g. 210940381"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 block">Study Stream</label>
              <select
                value={tempStream}
                onChange={(e) => setTempStream(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold text-slate-700 cursor-pointer"
              >
                <option value="B.pharm">B.pharm (Bachelor of Pharmacy)</option>
                <option value="D.pharm">D.pharm (Diploma in Pharmacy)</option>
                <option value="">General Python / Science</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-200/40">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-extrabold hover:bg-indigo-700 shadow-md shadow-indigo-600/15 cursor-pointer"
              >
                Update Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 bg-indigo-50/40 border border-indigo-100 rounded-2xl p-3.5">
            <Flame className="w-5 h-5 text-indigo-600 fill-indigo-100" />
            <p className="text-xs text-indigo-950 font-medium">
              Hey <strong className="text-indigo-600">{progress.userName}</strong>! Pawan Sir appreciates your devotion. Complete chapters to unlock your certification!
            </p>
          </div>
        )}
      </div>

      {/* Progress metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Syllabus Progress */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/60 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Syllabus Progress</p>
              <h4 className="text-3xl font-extrabold text-slate-800 mt-1.5">{percentComplete}%</h4>
            </div>
            <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-slate-450 mt-2.5 uppercase tracking-wide">
              {completedCount} of {totalTopics} chapters mastered
            </p>
          </div>
        </div>

        {/* Metric 2: Quiz Accuracy */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/60 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Quiz Accuracy</p>
              <h4 className="text-3xl font-extrabold text-slate-800 mt-1.5">
                {totalQuizzesAttempted > 0 ? `${averageQuizScore}%` : '0%'}
              </h4>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5">
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {totalQuizzesAttempted > 0 
                ? `Cleared quizzes in ${totalQuizzesAttempted} chapters!` 
                : 'Solve quizzes in WhatsApp chat to generate scorecard.'}
            </p>
          </div>
        </div>

        {/* Metric 3: Active Status */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/60 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pawan Sir's Opinion</p>
              <h4 className="text-xs sm:text-sm font-bold text-indigo-950 mt-2 leading-snug">
                {percentComplete === 0 ? 'Shuruaat karein beta! 🚀' : percentComplete < 50 ? 'Bahut badhiya, seekhte raho! 📚' : percentComplete < 100 ? 'Aap bilkul sahi raaste par hain! 🌟' : 'Waah beta! You are a Pharmacy Python Master! 🎓'}
              </h4>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-2xl text-purple-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5">
            <p className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">
              Faculty: Mr. Pawan Pandey (Tutor)
            </p>
          </div>
        </div>
      </div>

      {/* Progress Checklist */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/60">
        <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 mb-4 uppercase tracking-wider">
          <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
          Syllabus Mastery Checklist
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {topics.map((topic) => {
            const isCompleted = progress.completedTopics.includes(topic.id);
            return (
              <div
                key={topic.id}
                onClick={() => onNavigateToTopic(topic.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isCompleted 
                    ? 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50' 
                    : topic.unlocked 
                      ? 'bg-slate-50 border-slate-150 hover:border-slate-350' 
                      : 'bg-slate-100/50 border-transparent opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-700 truncate">{topic.name}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Panel */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="space-y-2.5 max-w-xl">
          <span className="bg-indigo-600/80 text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-extrabold border border-indigo-400/20">
            Python Mastery Certificate
          </span>
          <h3 className="text-xl font-black tracking-tight">Aapka Certificate Ready Hai?</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Syllabus ke saare 16 chapters complete karke quizzes solve kijiye. Jaise hi aapka 100% complete hoga, hamara system aapko <strong>Mr. Pawan Pandey</strong> (PyGuru AI Tutor) dwara signed verified certificate generate karke dega. Isko aap save karke print kar sakte hain!
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center gap-2">
          {isCompleted ? (
            <button
              onClick={handlePrintCertificate}
              className="flex items-center gap-2 px-5.5 py-3.5 bg-indigo-600 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Certificate
            </button>
          ) : (
            <div className="text-center bg-slate-800/40 border border-slate-700/40 p-4.5 rounded-2xl min-w-[120px]">
              <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider mb-1">Your Progress</div>
              <div className="text-4xl font-black text-indigo-400">{percentComplete}%</div>
              <div className="text-[9px] text-slate-400 mt-1.5 uppercase font-semibold">Need 100% to print</div>
            </div>
          )}
        </div>
      </div>

      {/* Actual Certificate markup hidden on-screen unless complete, but styled beautifully for window.print() */}
      {isCompleted && (
        <div className="hidden print:block bg-white p-8 border-[12px] border-amber-900/40 rounded-sm w-full max-w-[900px] mx-auto text-slate-800 text-center relative aspect-[1.414/1] shadow-xl font-sans">
          {/* Borders */}
          <div className="border border-amber-800/20 p-8 h-full flex flex-col justify-between items-center relative">
            {/* Corner Badges */}
            <div className="absolute top-2 left-2 text-[10px] text-amber-800 font-mono">ID: PY-VERIFIED-{progress.userName.slice(0,3).toUpperCase()}-{totalQuizzesAttempted}</div>
            <div className="absolute top-2 right-2 text-[10px] text-amber-800 font-mono">{progress.joinedDate}</div>
 
            {/* Logo/Header */}
            <div className="space-y-2 mt-4">
              <div className="text-amber-800 font-serif tracking-[0.2em] uppercase text-sm font-bold">Certificate of Completion</div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-wide">PYTHON PROGRAMMING MASTERY</h1>
              <p className="text-xs italic text-slate-500">Presented proudly to</p>
            </div>
 
            {/* Student Name */}
            <div className="my-6">
              <h2 className="text-4xl font-serif font-bold text-amber-900 border-b border-slate-200 px-12 pb-2 inline-block">
                {progress.userName}
              </h2>
              {progress.rollNumber && (
                <p className="text-xs font-semibold text-slate-500 mt-1">Roll No: {progress.rollNumber} • {progress.stream || 'Pharmacy Student'}</p>
              )}
            </div>
 
            {/* Body */}
            <div className="max-w-[600px] space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                For successfully mastering all foundational, intermediate, and advanced core modules of Python programming. This curriculum included Variables, OOP concepts, File I/O, SQLite Database integration, Web API consumption, and Python applications in <strong>Pharmaceutical Science, Data Analysis, Scientific Research, and Automation</strong>.
              </p>
              <p className="text-[10px] text-slate-400">
                Verified by Python Tutor AI powered by Google Gemini. Completed with {totalQuizzesAttempted} quizzes and practical lab challenges.
              </p>
            </div>
 
            {/* Signatures */}
            <div className="flex justify-between items-end w-full px-12 mt-8">
              <div className="text-center w-40">
                <div className="font-serif italic text-sm text-slate-700 h-8 flex items-end justify-center">Verified AI Stamp</div>
                <div className="border-t border-slate-300 pt-1 text-[10px] text-slate-400">STATUS: SUCCESS</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-500/10 border-2 border-dashed border-amber-600 rounded-full flex items-center justify-center relative transform rotate-12">
                  <Award className="w-8 h-8 text-amber-800" />
                  <div className="absolute text-[8px] font-bold text-amber-800 tracking-wider">VERIFIED</div>
                </div>
              </div>
              <div className="text-center w-40">
                <div className="font-serif italic text-sm text-indigo-750 h-8 flex items-end justify-center font-extrabold">Mr. Pawan Pandey</div>
                <div className="border-t border-slate-300 pt-1 text-[10px] text-slate-400">Personal AI Tutor</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
