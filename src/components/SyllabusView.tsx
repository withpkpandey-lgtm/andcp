/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Lock, Unlock, CheckCircle2, MessageSquare, Play, HelpCircle, Code } from 'lucide-react';
import { Topic, TopicCategory } from '../types';

interface SyllabusViewProps {
  topics: Topic[];
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onStartLecture: (topic: Topic) => void;
  onStartQuiz: (topic: Topic) => void;
  onLoadProject: (topic: Topic) => void;
}

export default function SyllabusView({
  topics,
  activeTopicId,
  onSelectTopic,
  onStartLecture,
  onStartQuiz,
  onLoadProject,
}: SyllabusViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | 'all'>('all');

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
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-100 hover:border-slate-300'
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
            <div
              key={topic.id}
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
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartLecture(topic);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Ask Pawan Sir 📱
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartQuiz(topic);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-xs font-bold hover:bg-indigo-100 active:scale-95 transition-all"
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
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-xs font-bold hover:bg-amber-100 active:scale-95 transition-all ml-auto"
                      >
                        <Code className="w-3.5 h-3.5" />
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
          );
        })}
      </div>
    </div>
  );
}
