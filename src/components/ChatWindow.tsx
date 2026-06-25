/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  CheckCheck, 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Sparkles, 
  BookOpen, 
  Printer, 
  Download, 
  User, 
  Laptop, 
  CheckCircle, 
  Copy, 
  AlertCircle
} from 'lucide-react';
import { Message, Topic, QuizQuestion } from '../types';

interface ChatWindowProps {
  messages: Message[];
  activeTopicId: string;
  topics: Topic[];
  onSendMessage: (text: string) => void;
  onQuizAnswer: (topicId: string, question: QuizQuestion, selectedIndex: number) => void;
  onLoadCodeInPlayground?: (code: string) => void;
  studentName?: string;
  studentRoll?: string;
  studentStream?: string;
}

export default function ChatWindow({
  messages,
  activeTopicId,
  topics,
  onSendMessage,
  onQuizAnswer,
  onLoadCodeInPlayground,
  studentName = 'Beta',
  studentRoll = '',
  studentStream = 'B.pharm'
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to render WhatsApp style bold formatting: *text* or **text** -> strong
  const formatWhatsAppText = (text: string) => {
    if (!text) return '';
    // Escape simple HTML
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Format bold (*word* or **word**)
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    // Format italic (_word_)
    escaped = escaped.replace(/_(.*?)_/g, '<em>$1</em>');

    // Format code blocks (inline `code`)
    escaped = escaped.replace(/`(.*?)`/g, '<code class="bg-indigo-50/70 font-mono text-[11px] px-1 py-0.5 rounded border border-indigo-100 text-indigo-700">$1</code>');

    // Line breaks
    return escaped.replace(/\n/g, '<br />');
  };

  // Extract code block content and format it with interactive playground loader
  const extractAndFormatCode = (text: string) => {
    if (!text) return null;
    const parts = text.split(/```/);
    return parts.map((part, index) => {
      // Odd indexes are code blocks
      if (index % 2 === 1) {
        // Extract language if specified, e.g., "python\nx = 5"
        const lines = part.split('\n');
        let lang = 'python';
        let codeContent = part;
        if (lines[0].toLowerCase() === 'python' || lines[0].toLowerCase() === 'py') {
          lang = 'python';
          codeContent = lines.slice(1).join('\n');
        }
        
        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 font-mono shadow-md text-left transition-all hover:border-indigo-500/50">
            <div className="bg-slate-950 px-3.5 py-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">{lang} program</span>
              </div>
              {onLoadCodeInPlayground && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadCodeInPlayground(codeContent.trim());
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Laptop className="w-3 h-3" />
                  Load to Playground ⚡
                </button>
              )}
            </div>
            <pre className="p-3.5 text-[11px] sm:text-xs leading-relaxed text-slate-100 overflow-x-auto select-all max-h-[300px]">
              <code>{codeContent.trim()}</code>
            </pre>
          </div>
        );
      } else {
        // Normal text
        return (
          <div 
            key={index} 
            dangerouslySetInnerHTML={{ __html: formatWhatsAppText(part) }} 
            className="whitespace-pre-wrap select-text font-sans text-xs sm:text-sm leading-relaxed"
          />
        );
      }
    });
  };

  // Predefined suggestion chips for easy student interaction
  const suggestions = [
    { label: 'Pawan Sir, next topic please! 📚', prompt: `Pawan Sir, please introduce the next topic for me!` },
    { label: 'Explain variables in Hinglish 🇮🇳', prompt: `Pawan Sir, can you explain variables in Hinglish with simple pharmacy lab examples?` },
    { label: 'Give me a dynamic quiz! 🎯', prompt: `Pawan Sir, take my quick test or quiz on the current topic!` },
    { label: 'Pharmaceutical Code check 🧪', prompt: `Pawan Sir, help me write a Python program for dilution or first-order drug half life.` },
  ];

  // PDF download logic
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const messagesHtml = messages.map(msg => {
      const isTutor = msg.sender === 'tutor';
      const senderName = isTutor ? 'Mr. Pawan Pandey (Tutor)' : `${studentName} (${studentStream})`;
      return `
        <div style="margin-bottom: 20px; padding: 15px; border-radius: 12px; background-color: ${isTutor ? '#f5f7ff' : '#ffffff'}; border: 1px solid #e2e8f0; page-break-inside: avoid;">
          <div style="font-weight: bold; font-size: 11px; color: ${isTutor ? '#4f46e5' : '#475569'}; margin-bottom: 6px; display: flex; justify-content: space-between;">
            <span>${senderName}</span>
            <span style="color: #94a3b8;">${msg.timestamp}</span>
          </div>
          <div style="font-size: 13px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            ${msg.text}
          </div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Python Study Notes - Mr. Pawan Pandey</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
              padding: 40px; 
              color: #334155; 
              max-width: 800px; 
              margin: 0 auto; 
              background-color: #fafafa;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px double #e2e8f0; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .logo { 
              font-size: 26px; 
              font-weight: 800; 
              color: #4f46e5; 
              letter-spacing: -0.5px;
            }
            .subtitle { 
              font-size: 14px; 
              color: #64748b; 
              margin-top: 6px; 
              font-weight: 500;
            }
            .student-info {
              background-color: #f1f5f9;
              border-radius: 8px;
              padding: 10px 15px;
              margin: 15px 0;
              font-size: 12px;
              display: flex;
              justify-content: space-around;
              color: #475569;
              font-weight: 600;
            }
            .footer { 
              text-align: center; 
              font-size: 11px; 
              color: #94a3b8; 
              border-top: 1px solid #e2e8f0; 
              padding-top: 20px; 
              margin-top: 40px; 
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">💊 PyGuru AI: Pharmaceutical Python Ledger 🐍</div>
            <div class="subtitle">Personal Tutor: Mr. Pawan Pandey (HOD Pharmaceutical Chemistry AI)</div>
            <div class="student-info">
              <span>Student: ${studentName}</span>
              <span>Roll No: ${studentRoll || 'N/A'}</span>
              <span>Stream: ${studentStream}</span>
            </div>
            <div style="font-size: 12px; color: #4f46e5; font-weight: bold; margin-top: 10px; background-color: #e0e7ff; display: inline-block; padding: 4px 12px; border-radius: 9999px;">
              Active Topic: ${currentTopic.name}
            </div>
          </div>
          <main>
            ${messagesHtml}
          </main>
          <div class="footer">
            Generated via PyGuru AI Hub. Verified by Mr. Pawan Pandey. Seekhte Raho, Badhte Raho!
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredMessages = messages.filter(m => {
    if (!searchQuery) return true;
    return m.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl relative transition-all duration-300">
      
      {/* Redesigned Trendy Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white px-5 py-4 flex items-center justify-between z-10 shrink-0 shadow-md">
        <div className="flex items-center gap-3.5">
          {/* Mr. Pawan Pandey Avatar */}
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-serif font-extrabold text-base border-2 border-indigo-300/40 shadow-inner">
              PP
            </div>
            {/* Active Status Ring */}
            <span className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-slate-950">
              <span className="block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-none">Mr. Pawan Pandey</h3>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wide">AI Tutor</span>
            </div>
            <p className="text-[10px] text-indigo-200 font-medium flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Online (Lecturer, Pharmaceutical Science)
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2.5 text-slate-300">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            title="Search Messages" 
            className={`p-2 hover:bg-slate-800/60 rounded-xl transition-all ${showSearch ? 'text-indigo-300 bg-slate-800' : 'text-slate-300'}`}
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            title="Download Study Notes as PDF" 
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save PDF</span>
          </button>
        </div>
      </div>

      {/* Dynamic Search Bar */}
      {showSearch && (
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2.5 flex items-center gap-2 shrink-0 animate-fadeIn z-10">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search in conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs focus:outline-none text-slate-700"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Modern High-End Chat Workspace with Custom Background Wallpaper */}
      <div 
        className="flex-1 overflow-y-auto px-5 py-6 space-y-5 relative"
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h1v1h-1zm40 40h1v1h-1zm30-20h1v1h-1zM20 80h1v1h-1zm60-10h1v1h-1z' fill='%236366f1' fill-opacity='0.035'/%3E%3C/svg%3E")`
        }}
      >
        {/* Customized Greetings banner with active student names */}
        <div className="max-w-md mx-auto bg-gradient-to-r from-indigo-50 to-indigo-100/40 border border-indigo-100 rounded-2xl p-4 text-center shadow-sm relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-[9px] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
            Profile Loaded
          </div>
          <p className="text-[11px] sm:text-xs text-indigo-950 font-medium leading-relaxed font-sans">
            👋 Swagat hai, <strong className="text-indigo-700">{studentName}</strong>! {studentStream && `(${studentStream} Student, Roll: ${studentRoll || 'N/A'})`}. <br />
            Aap <strong>Mr. Pawan Sir</strong> se koi bhi Python code likhne ko bol sakte hain. Niche program library se bhi programs select kar sakte hain!
          </p>
        </div>

        {/* Dynamic Messages */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs text-slate-400 font-semibold">No messages found. Try another prompt or click below!</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isTutor = msg.sender === 'tutor';
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
                  isTutor ? 'self-start' : 'self-end'
                }`}
              >
                {/* Bubble styling */}
                <div
                  className={`p-4 rounded-3xl relative shadow-md ${
                    isTutor
                      ? 'bg-white rounded-tl-none border border-slate-200/70 text-slate-800'
                      : 'bg-indigo-600 rounded-tr-none self-end text-white'
                  }`}
                >
                  {/* Sender Name */}
                  {isTutor && (
                    <div className="text-[10px] font-extrabold text-indigo-600 mb-1 flex items-center gap-1">
                      <span>Pawan Sir (Tutor)</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[8px] uppercase text-slate-400">Pharmacist Expert</span>
                    </div>
                  )}

                  {/* Simulated typing dot-loader */}
                  {msg.isTyping ? (
                    <div className="flex gap-1.5 py-2 px-1 items-center">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Message Body Text with custom Code Block Extractors */}
                      {isTutor ? (
                        <div className="space-y-1">
                          {extractAndFormatCode(msg.text)}
                        </div>
                      ) : (
                        <p
                          className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text font-sans"
                          dangerouslySetInnerHTML={{ __html: formatWhatsAppText(msg.text) }}
                        />
                      )}

                      {/* Integrated Interactive MCQ Quiz Widget */}
                      {msg.type === 'quiz' && msg.quizData && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                            <BookOpen className="w-4 h-4 text-indigo-600" />
                            Lesson Checkup Quiz:
                          </div>
                          <p className="text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100/80">
                            {msg.quizData.question}
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.quizData.options.map((opt, optIdx) => {
                              const isAnswered = msg.quizAnsweredIndex !== undefined;
                              const isSelected = msg.quizAnsweredIndex === optIdx;
                              const isCorrectAnswer = optIdx === msg.quizData?.answerIndex;

                              let optionStyle = 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300';
                              if (isAnswered) {
                                if (isSelected) {
                                    optionStyle = msg.quizIsCorrect 
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold ring-2 ring-emerald-500/20' 
                                      : 'bg-rose-50 text-rose-800 border-rose-300 font-bold ring-2 ring-rose-500/20';
                                } else if (isCorrectAnswer) {
                                  optionStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
                                } else {
                                  optionStyle = 'bg-slate-50 text-slate-400 border-slate-100 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={isAnswered}
                                  onClick={() => onQuizAnswer(currentTopic.id, msg.quizData!, optIdx)}
                                  className={`w-full p-3 rounded-2xl border text-xs text-left transition-all ${optionStyle} cursor-pointer`}
                                >
                                  <span className="font-bold mr-2 font-mono">{String.fromCharCode(65 + optIdx)}.</span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {/* Quiz Answer Feedback details */}
                          {msg.quizAnsweredIndex !== undefined && (
                            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border animate-slideUp ${
                              msg.quizIsCorrect 
                                ? 'bg-emerald-50 border-emerald-200/60 text-emerald-850' 
                                : 'bg-rose-50 border-rose-200/60 text-rose-850'
                            }`}>
                              <strong>{msg.quizIsCorrect ? '🎉 Sahi Jawab, Bohat Badhiya!' : '❌ Seekhein, Dobara Koshish Karein!'}</strong>
                              <p className="mt-1.5 font-sans text-slate-700 leading-relaxed">{msg.quizData.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamp and ticks bar */}
                  <div className={`flex items-center justify-end gap-1 mt-2 text-[9px] select-none font-semibold ${
                    isTutor ? 'text-slate-400' : 'text-indigo-200'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {!isTutor && !msg.isTyping && (
                      <CheckCheck className="w-3.5 h-3.5 text-indigo-300" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Dummy div to secure scrolling anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips Panel */}
      <div className="bg-slate-50 border-t border-slate-100 p-2.5 flex gap-2 overflow-x-auto shrink-0 scrollbar-none z-10">
        {suggestions.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(chip.prompt)}
            className="flex items-center gap-1.5 shrink-0 px-3.5 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-indigo-500 hover:text-indigo-700 hover:bg-indigo-50/30 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* WhatsApp Message Input Panel */}
      <div className="bg-slate-50 border-t border-slate-200/60 px-4 py-3.5 flex items-center gap-3 shrink-0 z-10">
        <button title="Smile/Emoji" className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-lg">
          <Smile className="w-5 h-5" />
        </button>
        <button title="Attach file" className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-lg">
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Area Input */}
        <div className="flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Ask Pawan Sir to write code, ${studentName}...`}
            className="w-full px-4.5 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-inner"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
