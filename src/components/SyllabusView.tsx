/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle2, MessageSquare, HelpCircle, Code, Film, X, Calendar, Database } from 'lucide-react';
import { Topic, TopicCategory } from '../types';

interface SyllabusViewProps {
  topics: Topic[];
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onStartLecture: (topic: Topic) => void;
  onStartQuiz: (topic: Topic) => void;
  onLoadProject: (topic: Topic) => void;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  syllabusAllowed?: boolean;
  activeVideo?: any;
  activeVideoUrl?: string;
  onCloseVideo?: () => void;
}

export default function SyllabusView({
  topics,
  activeTopicId,
  onSelectTopic,
  onStartLecture,
  onStartQuiz,
  onLoadProject,
  approvalStatus = 'pending',
  syllabusAllowed = true,
  activeVideo,
  activeVideoUrl,
  onCloseVideo,
}: SyllabusViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | 'all'>('all');

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isApproved = approvalStatus === 'approved';
  const isSyllabusAllowed = syllabusAllowed !== false;

  if (!isApproved || !isSyllabusAllowed) {
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
            Syllabus Path Locked 📚
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-sans">
            {!isApproved 
              ? '"Beta, is learning path ko access karne ke liye aapka account approved hona chahiye. Kripya Pawan Sir se contact karein aur apna profile verify karwayein!"'
              : '"Beta, aapke account par Syllabus Path permission ko temporary disable kiya gaya hai. Kripya Pawan Sir se baat karein!"'}
          </p>
        </div>
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/50 max-w-md mx-auto text-left space-y-2 font-sans">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Current Status: <span className="uppercase font-extrabold text-amber-600">{!isApproved ? approvalStatus : 'Permission Disabled 🔒'}</span>
          </div>
          <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
            {!isApproved 
              ? 'Jaise hi Pawan sir dashboard se verify karke green signal denge, aapka full syllabus learning module unlock ho jayega. Tab tak aap chat screen par Pawan Sir se baat kar sakte hain!'
              : 'Pawan sir jaise hi admin panel se "Syllabus" permission ko enable (green ✅) karenge, aapka module fir se active ho jayega!'}
          </p>
        </div>
      </div>
    );
  }

  const categories: { value: TopicCategory | 'all'; label: string; desc: string }[] = [
    { value: 'all', label: 'All Modules 📚', desc: 'Complete Python Learning Path' },
    { value: 'basics', label: 'Basics 🚀', desc: 'Variables, Data Types, I/O, Operators' },
    { value: 'intermediate', label: 'Intermediate ⚙️', desc: 'Conditions, Loops, Functions, Libraries' },
    { value: 'advanced', label: 'Advanced 💻', desc: 'File Handling, Exceptions, OOP, Database, APIs' },
    { value: 'applications', label: 'Applications 🔬', desc: 'Pharma, Data, Research & Automation' },
  ];

  const filteredTopics = selectedCategory === 'all' 
    ? topics 
    : topics.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4.5 py-2.5 rounded-2xl text-xs font-extrabold shrink-0 transition-all duration-300 transform active:scale-95 cursor-pointer ${
              selectedCategory === cat.value
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/15'
                : 'bg-white text-slate-600 border border-slate-100/80 hover:border-indigo-200 hover:text-indigo-600 hover:scale-[1.01]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm">
          {categories.find(c => c.value === selectedCategory)?.label}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {categories.find(c => c.value === selectedCategory)?.desc}
        </p>
      </div>

      {/* Topic Cards List */}
      <div className="space-y-3">
        {filteredTopics.map((topic) => {
          const isSelected = topic.id === activeTopicId;
          return (
            <React.Fragment key={topic.id}>
              {isSelected && activeVideo && (
                <div 
                  id="video-theatre-player-syllabus" 
                  className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl text-left space-y-4 animate-fadeIn mb-4"
                >
                  {/* Theatre Header */}
                  <div className="px-5 py-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Film className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-black tracking-widest text-indigo-400">Now Playing / अभी चल रहा है</p>
                        <h3 className="font-bold text-slate-200 text-xs sm:text-sm truncate">{activeVideo.name}</h3>
                      </div>
                    </div>
                    {onCloseVideo && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCloseVideo();
                        }}
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-all cursor-pointer"
                        title="Close Player"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Video element container */}
                  <div className="aspect-video bg-black relative flex items-center justify-center">
                    <video 
                      src={activeVideoUrl} 
                      controls 
                      autoPlay
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Video info bar */}
                  <div className="p-4 bg-slate-950/40 border-t border-slate-850">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Uploaded: {activeVideo.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-indigo-400" />
                        <span>File Size: {formatSize(activeVideo.size)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div
                onClick={() => topic.unlocked && onSelectTopic(topic.id)}
                className={`bg-white rounded-2xl p-4 border transition-all relative overflow-hidden ${
                  isSelected 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/10' 
                    : topic.unlocked 
                      ? 'border-slate-100 hover:border-slate-300 hover:shadow-sm cursor-pointer' 
                      : 'border-slate-100 bg-slate-50/50 opacity-75'
                }`}
              >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    {topic.completed ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 fill-emerald-50" />
                    ) : topic.unlocked ? (
                      <Unlock className="w-4 h-4 text-indigo-500 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                      {topic.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {topic.description}
                  </p>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
                  {topic.category}
                </span>
              </div>

              {/* Syllabus Sub-items */}
              {topic.unlocked && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    What you will learn:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
                    {topic.syllabus.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartLecture(topic);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-extrabold hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Ask Pawan Sir 📱
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartQuiz(topic);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50/70 text-indigo-700 border border-indigo-100/60 rounded-xl text-xs font-extrabold hover:bg-indigo-100 active:scale-95 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Take Quiz 🎯
                    </button>

                    {topic.projectDescription && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadProject(topic);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 rounded-xl text-xs font-extrabold hover:shadow-lg hover:shadow-amber-500/15 active:scale-95 hover:scale-[1.02] transition-all ml-auto cursor-pointer"
                      >
                        <Code className="w-3.5 h-3.5 text-slate-900" />
                        Lab Project 🧪
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Locked overlay placeholder card style */}
              {!topic.unlocked && (
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Locked: Complete previous modules to unlock!</span>
                </div>
              )}
            </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
