/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Award, 
  Code, 
  Smartphone, 
  Sparkles, 
  Volume2, 
  GraduationCap, 
  CheckCircle2, 
  FolderOpen 
} from 'lucide-react';
import { Topic, Message, StudentProgress, INITIAL_TOPICS, QuizQuestion } from './types';
import ChatWindow from './components/ChatWindow';
import SyllabusView from './components/SyllabusView';
import ProgressCard from './components/ProgressCard';
import CodePlayground from './components/CodePlayground';

export default function App() {
  // 1. Core States
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string>('variables');
  const [activeTab, setActiveTab] = useState<'chat' | 'syllabus' | 'progress'>('chat');
  
  const [progress, setProgress] = useState<StudentProgress>({
    userName: 'Rohan Verma',
    completedTopics: [],
    quizScores: {},
    currentTopicId: 'variables',
    joinedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  });

  const [loading, setLoading] = useState(false);

  // 2. LocalStorage Hydration
  useEffect(() => {
    const savedTopics = localStorage.getItem('tutor_topics');
    const savedProgress = localStorage.getItem('tutor_progress');
    const savedMessages = localStorage.getItem('tutor_messages');

    if (savedTopics) {
      try { setTopics(JSON.parse(savedTopics)); } catch (e) { console.error(e); }
    }
    if (savedProgress) {
      try { 
        const parsedProg = JSON.parse(savedProgress);
        setProgress(parsedProg);
        if (parsedProg.currentTopicId) {
          setActiveTopicId(parsedProg.currentTopicId);
        }
      } catch (e) { console.error(e); }
    }

    // Default welcome messages if none saved
    if (savedMessages) {
      try { setMessages(JSON.parse(savedMessages)); } catch (e) { console.error(e); }
    } else {
      const defaultWelcome: Message[] = [
        {
          id: 'welcome_1',
          sender: 'tutor',
          text: `*Namaste Beta!* 🙏 Welcome to your personal *WhatsApp Python Tutor* program! 🐍

Mera naam *Mr. Pawan Pandey* hai, aur main aapka coding teacher hoon. Main aapko absolute zero level se lekar advanced dynamic applications aur scientific script levels tak ka Python seekhaunga.

*Hum log kya kya seekhenge:*
1. *Basics:* Variables, Data types, I/O, aur Operators.
2. *Intermediate:* Conditions, Loops, Functions, aur Libraries.
3. *Advanced:* OOP, File handling, SQL Databases aur Web APIs.
4. *Applications:* Pharmaceutical Science 🧪, Data analysis 📊, Research 🔬 aur Automation ⚙️.

Aap is chat me direct mujhse baat kar sakte hain. Hinglish me samjhna ho to niche di gyi chips par click karein ya syllabus list se select karein!`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'welcome_2',
          sender: 'tutor',
          text: `Chalo beta, lets start! *Variables in Python* hamara pehla module hai. 

Aap side panel par template code dekh sakte hain aur dynamic answers test karne ke liye *Run Script* par click kar sakte hain. 

Jab aap ready ho, to mujhe is chapter ka *Quiz* lene ko boleya, ya syllabus panel se *Take Quiz* button dabaayein! 👍`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(defaultWelcome);
    }
  }, []);

  // 3. Persist State Changes
  const saveStateToLocalStorage = (updatedTopics: Topic[], updatedProgress: StudentProgress, updatedMessages: Message[]) => {
    localStorage.setItem('tutor_topics', JSON.stringify(updatedTopics));
    localStorage.setItem('tutor_progress', JSON.stringify(updatedProgress));
    localStorage.setItem('tutor_messages', JSON.stringify(updatedMessages));
  };

  // 4. Send Message to AI Tutor backend
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userTimestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'user_' + Date.now();
    const newUserMsg: Message = {
      id: userMsgId,
      sender: 'student',
      text: text,
      timestamp: userTimestamp
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    saveStateToLocalStorage(topics, progress, updatedMessages);

    // Trigger typing state
    const tutorTimestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const typingMsgId = 'typing_' + Date.now();
    const typingMsg: Message = {
      id: typingMsgId,
      sender: 'tutor',
      text: '',
      timestamp: tutorTimestamp,
      isTyping: true
    };

    setMessages([...updatedMessages, typingMsg]);

    try {
      // Collect only text messages for history (excluding typing status)
      const historyContext = updatedMessages
        .filter(m => !m.isTyping && m.type !== 'quiz')
        .slice(-10) // Limit context window
        .map(m => ({
          sender: m.sender,
          text: m.text
        }));

      const activeTopic = topics.find(t => t.id === activeTopicId);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyContext,
          currentTopic: activeTopic ? `${activeTopic.name}: ${activeTopic.description}` : 'General queries'
        })
      });

      const data = await response.json();
      
      // Update chat list by replacing the typing message
      const finalMsgText = data.text || "Sorry beta, network error lag raha hai. Phir se bolo! 🙏";
      const actualTutorMsg: Message = {
        id: 'tutor_' + Date.now(),
        sender: 'tutor',
        text: finalMsgText,
        timestamp: tutorTimestamp
      };

      // Detect if AI response contains code blocks to automatically present them as readable types
      if (finalMsgText.includes('```')) {
        actualTutorMsg.type = 'code';
      }

      const completedMsgs = updatedMessages.concat(actualTutorMsg);
      setMessages(completedMsgs);
      saveStateToLocalStorage(topics, progress, completedMsgs);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: 'error_' + Date.now(),
        sender: 'tutor',
        text: "Beta, AI server offline lag raha hai or API key limit reached. Ek baar checkout parameters please! 🔒",
        timestamp: tutorTimestamp
      };
      const completedMsgs = updatedMessages.concat(errorMsg);
      setMessages(completedMsgs);
      saveStateToLocalStorage(topics, progress, completedMsgs);
    }
  };

  // 5. Trigger topic introductory lecture from sidebar
  const handleStartLecture = (topic: Topic) => {
    setActiveTopicId(topic.id);
    setActiveTab('chat');
    
    // Construct automated teacher introduction prompt
    const welcomePrompt = `Pawan Sir, please introduce me to the chapter: *${topic.name}*. Tell me what we will learn, why it is important, and give me a simple real-life analogy in Hinglish.`;
    handleSendMessage(welcomePrompt);
  };

  // 6. Trigger specific topic quiz bubble inside WhatsApp
  const handleStartQuiz = (topic: Topic) => {
    setActiveTopicId(topic.id);
    setActiveTab('chat');

    const randomQuizQuestion = topic.quiz[Math.floor(Math.random() * topic.quiz.length)];

    const tutorTimestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const quizMsg: Message = {
      id: 'quiz_' + Date.now(),
      sender: 'tutor',
      text: `Waah beta! Chalo ek short test ho jaye aapka chapter *${topic.name}* par! 🎯\nNiche diye gaye multiple-choice question ka sahi answer select karo:`,
      timestamp: tutorTimestamp,
      type: 'quiz',
      quizData: randomQuizQuestion
    };

    const updated = [...messages, quizMsg];
    setMessages(updated);
    saveStateToLocalStorage(topics, progress, updated);
  };

  // 7. Handles clicking on MCQ option button inside chat
  const handleQuizAnswer = (topicId: string, question: QuizQuestion, selectedIndex: number) => {
    const isCorrect = selectedIndex === question.answerIndex;

    // Find and update the specific quiz message in state
    const updatedMessages = messages.map(m => {
      if (m.type === 'quiz' && m.quizData && m.quizData.question === question.question) {
        return {
          ...m,
          quizAnsweredIndex: selectedIndex,
          quizIsCorrect: isCorrect
        };
      }
      return m;
    });

    // Update Student progress metrics
    const topicQuizScores = progress.quizScores[topicId] || { score: 0, total: 0 };
    const updatedScores = {
      ...progress.quizScores,
      [topicId]: {
        score: isCorrect ? topicQuizScores.score + 1 : topicQuizScores.score,
        total: topicQuizScores.total + 1
      }
    };

    // Calculate completed topics list
    let updatedCompletedList = [...progress.completedTopics];
    if (isCorrect && !updatedCompletedList.includes(topicId)) {
      updatedCompletedList.push(topicId);
    }

    // Auto-unlock next topic in sequence
    const updatedTopics = topics.map((t, index) => {
      const isCurrent = t.id === topicId;
      if (isCurrent && isCorrect) {
        return { ...t, completed: true };
      }
      // Unlock next topic if current is completed
      if (index > 0 && topics[index - 1].id === topicId && isCorrect) {
        return { ...t, unlocked: true };
      }
      return t;
    });

    const updatedProgress = {
      ...progress,
      quizScores: updatedScores,
      completedTopics: updatedCompletedList
    };

    setTopics(updatedTopics);
    setProgress(updatedProgress);
    setMessages(updatedMessages);

    saveStateToLocalStorage(updatedTopics, updatedProgress, updatedMessages);

    // Send instant tutor congratulations or help feedback bubble in chat
    setTimeout(() => {
      const autoFeedbackText = isCorrect
        ? `*Shabaash beta!* 🎉 Aapka answer bilkul sahi hai! \n\n_${question.explanation}_\n\nHumne aapke report card par updates kar diye hain. Sahi raaste par hain, chalo agla topic seekhein ya is chapter ka code run karein! 👍`
        : `*Koi baat nahi bacha!* Learn from mistakes. 🙏 \n\nSahi answer tha: *${question.options[question.answerIndex]}*.\n\n_${question.explanation}_\n\nDobara se quiz try karne ke liye side panel par click karein. Aap is code ko playground me run karke results verify kar sakte hain!`;

      const feedbackMsg: Message = {
        id: 'feedback_' + Date.now(),
        sender: 'tutor',
        text: autoFeedbackText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, feedbackMsg];
      setMessages(finalMessages);
      saveStateToLocalStorage(updatedTopics, updatedProgress, finalMessages);
    }, 1200);
  };

  // 8. Loaded topic project into the right playground
  const handleLoadProjectInPlayground = (topic: Topic) => {
    setActiveTopicId(topic.id);
    setMessages([...messages, {
      id: 'proj_msg_' + Date.now(),
      sender: 'tutor',
      text: `🧪 *Chapter Project Loaded:* Humne aapke liye *${topic.name}* ka experimental project loading template playground panel me setup kar diya hai.\n\nRight side par di gayi problems/scenarios ko solve karein aur code verify karne ke liye *Run Script* par click karein! All the best beta.`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  // 9. When user runs playground project successfully (exitCode 0)
  const handleCodeRunSuccess = (topicId: string) => {
    // If not already marked completed, celebrate in chat!
    if (!progress.completedTopics.includes(topicId)) {
      const updatedCompletedList = [...progress.completedTopics, topicId];
      const updatedTopics = topics.map((t, index) => {
        if (t.id === topicId) {
          return { ...t, completed: true };
        }
        if (index > 0 && topics[index - 1].id === topicId) {
          return { ...t, unlocked: true };
        }
        return t;
      });

      const updatedProgress = {
        ...progress,
        completedTopics: updatedCompletedList
      };

      setTopics(updatedTopics);
      setProgress(updatedProgress);

      const successFeedbackMsg: Message = {
        id: 'success_code_' + Date.now(),
        sender: 'tutor',
        text: `🎉 *Waah Beta! Shabaash!* Aapka lab code project successfully compiled ho chuka hai bin kisi output warning ke! 

Main dekh rha hu aapne *${topics.find(t => t.id === topicId)?.name}* ka lab exercise sahi se crack kar liya hai. Chalo, agle level par chalte hain! 🚀`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      const finalMsgs = [...messages, successFeedbackMsg];
      setMessages(finalMsgs);
      saveStateToLocalStorage(updatedTopics, updatedProgress, finalMsgs);
    }
  };

  const handleUpdateProfile = (newName: string, newRoll: string, newStream: 'B.pharm' | 'D.pharm' | '') => {
    const updatedProgress = { 
      ...progress, 
      userName: newName, 
      rollNumber: newRoll, 
      stream: newStream 
    };
    setProgress(updatedProgress);
    saveStateToLocalStorage(topics, updatedProgress, messages);
  };

  // Calculate current progress count
  const completedCount = progress.completedTopics.length;
  const totalCount = topics.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500/20">
      {/* Top Banner Branding Header */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-20 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-600/10">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-slate-800 tracking-tight text-lg sm:text-xl">
                  PyGuru AI
                </h1>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[9px] px-2 py-0.5 rounded-full">
                  Hinglish 🇮🇳
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">
                Bilingual Support: Hindi + English Active (Mr. Pawan Pandey)
              </p>
            </div>
          </div>

          {/* Quick Stats Header Widget */}
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200/50">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">My Syllabus Progress</span>
              <span className="text-xs font-extrabold text-slate-700">{completedCount} / {totalCount} chapters mastered</span>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-600 relative overflow-hidden">
              {percentComplete}%
              <div 
                className="absolute inset-0 bg-indigo-500/10 origin-bottom transition-transform duration-500"
                style={{ transform: `scaleY(${percentComplete / 100})` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Responsive Grid Layout Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column Dashboard Container: Handles Chat, Syllabus list, and Report cards (7 cols) */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
          
          {/* Navigation Bar Selector */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200/60 shadow-sm flex gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Tutor AI 📱
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'syllabus'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Syllabus Path 📚
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'progress'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              My Certificate 🏆
            </button>
          </div>

          {/* Active Tab rendering panel */}
          <div className="flex-1">
            {activeTab === 'chat' && (
              <ChatWindow
                messages={messages}
                activeTopicId={activeTopicId}
                topics={topics}
                onSendMessage={handleSendMessage}
                onQuizAnswer={handleQuizAnswer}
                onLoadCodeInPlayground={(code) => {
                  const event = new CustomEvent('load-code-to-playground', { detail: code });
                  window.dispatchEvent(event);
                }}
                studentName={progress.userName}
                studentRoll={progress.rollNumber}
                studentStream={progress.stream}
              />
            )}

            {activeTab === 'syllabus' && (
              <SyllabusView
                topics={topics}
                activeTopicId={activeTopicId}
                onSelectTopic={setActiveTopicId}
                onStartLecture={handleStartLecture}
                onStartQuiz={handleStartQuiz}
                onLoadProject={handleLoadProjectInPlayground}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressCard
                progress={progress}
                topics={topics}
                onUpdateProfile={handleUpdateProfile}
                onNavigateToTopic={(id) => {
                  setActiveTopicId(id);
                  setActiveTab('syllabus');
                }}
              />
            )}
          </div>
        </div>

        {/* Right Column Container: Persistent Sandbox, Compiler & AI Debugger Console (5 cols) */}
        <div className="lg:col-span-6 xl:col-span-5">
          <div className="lg:sticky lg:top-24 h-full">
            <CodePlayground
              topics={topics}
              activeTopicId={activeTopicId}
              onCodeRunSuccess={handleCodeRunSuccess}
            />
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[11px] text-slate-400 shrink-0 font-medium">
        Designed for Google AI Studio Build. Practice safe coding beta. 🔒
      </footer>
    </div>
  );
}
