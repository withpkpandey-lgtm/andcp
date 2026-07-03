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
  FolderOpen,
  Users,
  ChevronDown,
  Plus,
  Trash2,
  X,
  User,
  FlaskConical,
  Lock,
  Video
} from 'lucide-react';
import { Topic, Message, StudentProgress, StudentProfile, INITIAL_TOPICS, QuizQuestion, LabProgram } from './types';
import ChatWindow from './components/ChatWindow';
import SyllabusView from './components/SyllabusView';
import ProgressCard from './components/ProgressCard';
import CodePlayground from './components/CodePlayground';
import LabLibraryView from './components/LabLibraryView';
import AdminPanel from './components/AdminPanel';
import VideoLecturesView from './components/VideoLecturesView';
import { containsAbusiveLanguage } from './lib/moderation';

// Helper welcome message generators
const getUnnamedWelcome = (): Message[] => [
  {
    id: 'welcome_unnamed_1',
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
  }
];

const getDefaultWelcome = (studentName: string): Message[] => [
  {
    id: 'welcome_1',
    sender: 'tutor',
    text: `*Namaste ${studentName === 'Beta' || !studentName ? 'Beta' : studentName + ' Beta'}!* 🙏 Welcome to your personal *WhatsApp Python Tutor* program! 🐍

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
    text: `Chalo beta, let's start! Hamara pehla module *Introduction to Python 🐍* hai. Isme hum dekhenge ki Python kya hai, iski kya importance hai, health aur pharma scientific field me iske kya uses hain, aur ye baaki programming languages se kyun alag aur simple hai!

Aap side panel par template code dekh sakte hain aur dynamic answers test karne ke liye *Run Script* par click kar sakte hain. 

Jab aap ready ho, to mujhe is chapter ka *Quiz* lene ko boleya, ya syllabus panel se *Take Quiz* button dabaayein! 👍`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
];

export default function App() {
  // 1. Core States
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string>('intro_python');
  const [activeTab, setActiveTab] = useState<'chat' | 'syllabus' | 'progress' | 'labs' | 'videos'>('chat');
  
  const [progress, setProgress] = useState<StudentProgress>({
    userName: '',
    completedTopics: [],
    quizScores: {},
    currentTopicId: 'intro_python',
    joinedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  });

  const [loading, setLoading] = useState(false);

  // Multi-Profile States
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAbuseWarning, setShowAbuseWarning] = useState(false);
  const [abuseWordDetected, setAbuseWordDetected] = useState('');
  const [activeLectureVideo, setActiveLectureVideo] = useState<any>(null);
  const [activeLectureVideoUrl, setActiveLectureVideoUrl] = useState<string>('');
  const [tutorPhoto, setTutorPhoto] = useState<string>(() => {
    return localStorage.getItem('tutor_photo_url') || '';
  });

  const handleUpdateTutorPhoto = (newPhoto: string) => {
    setTutorPhoto(newPhoto);
    localStorage.setItem('tutor_photo_url', newPhoto);
  };

  const getNextCbid = () => {
    let nextNum = 1;
    const cbidPrefix = "CBID-";
    profiles.forEach(p => {
      const roll = p.progress.rollNumber;
      if (roll && roll.startsWith(cbidPrefix)) {
        const numStr = roll.substring(cbidPrefix.length);
        const num = parseInt(numStr, 10);
        if (!isNaN(num) && num >= nextNum) {
          nextNum = num + 1;
        }
      }
    });
    return `${cbidPrefix}${nextNum}`;
  };

  const [notificationToast, setNotificationToast] = useState<{
    show: boolean;
    name: string;
    message: string;
    directLink: string;
  } | null>(null);

  // Labs State & Persisted Custom Labs
  const [customLabs, setCustomLabs] = useState<LabProgram[]>(() => {
    const savedCustomLabs = localStorage.getItem('tutor_custom_labs');
    if (savedCustomLabs) {
      try {
        return JSON.parse(savedCustomLabs);
      } catch (e) {
        console.error("Failed to parse custom labs:", e);
      }
    }
    return [];
  });

  const handleAddCustomLab = (newLab: LabProgram) => {
    const updated = [...customLabs, newLab];
    setCustomLabs(updated);
    localStorage.setItem('tutor_custom_labs', JSON.stringify(updated));
  };

  const handleEditCustomLab = (editedLab: LabProgram) => {
    const updated = customLabs.map(l => l.id === editedLab.id ? editedLab : l);
    setCustomLabs(updated);
    localStorage.setItem('tutor_custom_labs', JSON.stringify(updated));
  };

  const handleDeleteCustomLab = (labId: string) => {
    const updated = customLabs.filter(l => l.id !== labId);
    setCustomLabs(updated);
    localStorage.setItem('tutor_custom_labs', JSON.stringify(updated));
  };

  // Lab Progress Helpers
  const handleMarkLabComplete = (labId: string) => {
    const currentCompleted = progress.completedLabs || [];
    if (!currentCompleted.includes(labId)) {
      const updatedProgress: StudentProgress = {
        ...progress,
        completedLabs: [...currentCompleted, labId]
      };
      updateActiveProfile(topics, updatedProgress, messages);
    }
  };

  const handleMarkLabAttempted = (labId: string) => {
    const currentAttempted = progress.attemptedLabs || [];
    if (!currentAttempted.includes(labId)) {
      const updatedProgress: StudentProgress = {
        ...progress,
        attemptedLabs: [...currentAttempted, labId]
      };
      updateActiveProfile(topics, updatedProgress, messages);
    }
  };

  const handleSaveLabSubmission = (labId: string, code: string, score: number, feedback: string) => {
    const currentSubmissions = progress.labSubmissions || {};
    const updatedProgress: StudentProgress = {
      ...progress,
      labSubmissions: {
        ...currentSubmissions,
        [labId]: {
          code,
          score,
          feedback,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        }
      }
    };
    updateActiveProfile(topics, updatedProgress, messages);
  };

  // 2. LocalStorage Hydration & Backward Compatibility Migration
  useEffect(() => {
    const savedProfiles = localStorage.getItem('tutor_profiles');
    const savedActiveProfileId = sessionStorage.getItem('tutor_active_profile_id');

    let loadedProfiles: StudentProfile[] = [];
    let loadedActiveId = '';

    if (savedProfiles) {
      try {
        const parsed = JSON.parse(savedProfiles) as StudentProfile[];
        loadedProfiles = parsed.map(p => {
          if (!p.progress.approvalStatus) {
            return {
              ...p,
              progress: {
                ...p.progress,
                approvalStatus: p.progress.userName ? 'pending' : 'approved'
              }
            };
          }
          return p;
        });
      } catch (e) {
        console.error("Failed to parse saved profiles:", e);
      }
    }

    if (savedActiveProfileId) {
      loadedActiveId = savedActiveProfileId;
    }

    // If no profiles exist but legacy data is available, migrate it to a profile!
    if (loadedProfiles.length === 0) {
      const savedTopics = localStorage.getItem('tutor_topics');
      const savedProgress = localStorage.getItem('tutor_progress');
      const savedMessages = localStorage.getItem('tutor_messages');

      let legacyProgress: StudentProgress | null = null;
      let legacyMessages: Message[] = [];
      let legacyTopics: Topic[] = INITIAL_TOPICS;

      if (savedProgress) {
        try { legacyProgress = JSON.parse(savedProgress); } catch (e) {}
      }
      if (savedMessages) {
        try { legacyMessages = JSON.parse(savedMessages); } catch (e) {}
      }
      if (savedTopics) {
        try { legacyTopics = JSON.parse(savedTopics); } catch (e) {}
      }

      if (legacyProgress) {
        const migratedProfile: StudentProfile = {
          id: 'profile_' + Date.now(),
          progress: legacyProgress,
          messages: legacyMessages.length > 0 ? legacyMessages : getUnnamedWelcome(),
          topicsState: legacyTopics
        };
        loadedProfiles = [migratedProfile];
        loadedActiveId = migratedProfile.id;
      } else {
        // Create an initial empty default profile
        const newProg: StudentProgress = {
          userName: '',
          completedTopics: [],
          quizScores: {},
          currentTopicId: 'intro_python',
          joinedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        const defaultProfile: StudentProfile = {
          id: 'profile_' + Date.now(),
          progress: newProg,
          messages: getUnnamedWelcome(),
          topicsState: INITIAL_TOPICS
        };
        loadedProfiles = [defaultProfile];
        loadedActiveId = defaultProfile.id;
      }
    }

    setProfiles(loadedProfiles);
    localStorage.setItem('tutor_profiles', JSON.stringify(loadedProfiles));

    if (loadedActiveId && loadedProfiles.some(p => p.id === loadedActiveId)) {
      setActiveProfileId(loadedActiveId);
    } else if (loadedProfiles.length > 0) {
      setActiveProfileId(loadedProfiles[0].id);
    }
  }, []);

  // Sync state when activeProfileId changes
  useEffect(() => {
    if (!activeProfileId || profiles.length === 0) return;
    const activeProf = profiles.find(p => p.id === activeProfileId);
    if (activeProf) {
      setTopics(activeProf.topicsState || INITIAL_TOPICS);
      setProgress(activeProf.progress);
      setMessages(activeProf.messages);
      if (activeProf.progress.currentTopicId) {
        setActiveTopicId(activeProf.progress.currentTopicId);
      }
      sessionStorage.setItem('tutor_active_profile_id', activeProfileId);
      
      // If the profile has a PIN configured, initialize it as locked
      if (activeProf.progress.pinCode) {
        setIsProfileLocked(true);
      } else {
        setIsProfileLocked(false);
      }
    }
  }, [activeProfileId, profiles.length]);

  // Synchronizes changes in active progress/messages/topics to the main profiles list and localStorage
  const updateActiveProfile = (
    updatedTopics: Topic[],
    updatedProgress: StudentProgress,
    updatedMessages: Message[]
  ) => {
    setTopics(updatedTopics);
    setProgress(updatedProgress);
    setMessages(updatedMessages);

    if (activeProfileId) {
      setProfiles(prevProfiles => {
        const newProfiles = prevProfiles.map(p => {
          if (p.id === activeProfileId) {
            return {
              ...p,
              progress: updatedProgress,
              messages: updatedMessages,
              topicsState: updatedTopics
            };
          }
          return p;
        });
        localStorage.setItem('tutor_profiles', JSON.stringify(newProfiles));
        return newProfiles;
      });
    }

    // Still sync to legacy items for safe fallback
    localStorage.setItem('tutor_topics', JSON.stringify(updatedTopics));
    localStorage.setItem('tutor_progress', JSON.stringify(updatedProgress));
    localStorage.setItem('tutor_messages', JSON.stringify(updatedMessages));
  };

  // 4. Send Message to AI Tutor backend
  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const moderationResult = containsAbusiveLanguage(text);
    if (moderationResult.hasAbuse) {
      setAbuseWordDetected(moderationResult.matchedWord || 'mannerless/abusive word');
      setShowAbuseWarning(true);

      const userTimestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const userMsgId = 'user_' + Date.now();
      const newUserMsg: Message = {
        id: userMsgId,
        sender: 'student',
        text: text,
        timestamp: userTimestamp,
        image: image
      };

      const tutorTimestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const systemWarningMsg: Message = {
        id: 'system_warn_' + Date.now(),
        sender: 'tutor',
        text: `⚠️ *[SYSTEM BLOCK / WARNING]:* PyGuru AI Tutor classes me abusive ya mannerless language ka prayog strictly forbidden hai! 🛑\n\nAapke message me gair-zimmedarana ya galat shabd/expression paye gaye hain. Is vajah se aapko chat se *block* kar diya gaya hai. Jab tak Pawan Sir aapko verify/approve nahi karenge, tab tak aap chat ya kisi task ka upyog nahi kar payenge. 😊`,
        timestamp: tutorTimestamp
      };

      const updatedProgress: StudentProgress = {
        ...progress,
        approvalStatus: 'rejected'
      };

      const finalMessages = [...messages, newUserMsg, systemWarningMsg];
      updateActiveProfile(topics, updatedProgress, finalMessages);
      return;
    }

    const userTimestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'user_' + Date.now();
    const newUserMsg: Message = {
      id: userMsgId,
      sender: 'student',
      text: text,
      timestamp: userTimestamp,
      image: image
    };

    const updatedMessages = [...messages, newUserMsg];

    // Intercept if userName is empty (conversational naming flow)
    if (false && !progress.userName) {
      setMessages(updatedMessages);

      const cleanText = text.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
      const isGreeting = ['hello', 'hi', 'hey', 'namaste', 'pranam', 'hlo', 'helo', 'salam', 'ram ram', 'greetings', 'morning', 'afternoon'].includes(cleanText);

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

      setTimeout(() => {
        if (isGreeting) {
          // Tutor asks for their name
          const tutorReply: Message = {
            id: 'tutor_' + Date.now(),
            sender: 'tutor',
            text: `*Namaste Beta!* 🙏 Welcome to your personal *WhatsApp Python Tutor* program! 🐍\n\nMera naam *Mr. Pawan Pandey* hai, aur main aapka coding teacher hoon.\n\nBeta, tutoring classes start karne se pehle, please **apna poora naam (Full Name) likh kar batayein**? 😊`,
            timestamp: tutorTimestamp
          };
          const finalMessages = [...updatedMessages, tutorReply];
          updateActiveProfile(topics, progress, finalMessages);
        } else {
          // Treat this input as their name!
          const extractedName = text.trim();
          const updatedProgress: StudentProgress = {
            ...progress,
            userName: extractedName,
            approvalStatus: 'pending'
          };

          const welcomeMsg1: Message = {
            id: 'welcome_1_' + Date.now(),
            sender: 'tutor',
            text: `*Namaste ${extractedName} Beta!* 🙏 Welcome to your personal *WhatsApp Python Tutor* program! 🐍

Mera naam *Mr. Pawan Pandey* hai, aur main aapka coding teacher hoon. Main aapko absolute zero level se lekar advanced dynamic applications aur scientific script levels tak ka Python seekhaunga.

*Hum log kya kya seekhenge:*
1. *Basics:* Variables, Data types, I/O, aur Operators.
2. *Intermediate:* Conditions, Loops, Functions, aur Libraries.
3. *Advanced:* OOP, File handling, SQL Databases aur Web APIs.
4. *Applications:* Pharmaceutical Science 🧪, Data analysis 📊, Research 🔬 aur Automation ⚙️.

Aap is chat me direct mujhse baat kar sakte hain. Hinglish me samjhna ho to niche di gyi chips par click karein ya syllabus list se select karein!`,
            timestamp: tutorTimestamp
          };

          const welcomeMsg2: Message = {
            id: 'welcome_2_' + Date.now(),
            sender: 'tutor',
            text: `Chalo *${extractedName}* beta, let's start! Hamara pehla module *Introduction to Python 🐍* hai. Isme hum dekhenge ki Python kya hai, iski kya importance hai, health aur pharma scientific field me iske kya uses hain, aur ye baaki programming languages se kyun alag aur simple hai!

Aap side panel par template code dekh sakte hain aur dynamic answers test karne ke liye *Run Script* par click kar sakte hain. 

Jab aap ready ho, to mujhe is chapter ka *Quiz* lene ko boleya, ya syllabus panel se *Take Quiz* button dabaayein! 👍`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };

          const finalMessages = [...updatedMessages, welcomeMsg1, welcomeMsg2];
          updateActiveProfile(topics, updatedProgress, finalMessages);
        }
      }, 1000);

      return;
    }

    setMessages(updatedMessages);
    updateActiveProfile(topics, progress, updatedMessages);

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
          text: m.image ? `[Attached Screenshot/Image] ${m.text}` : m.text
        }));

      const activeTopic = topics.find(t => t.id === activeTopicId);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          image: image, // Send base64 image URL to server
          history: historyContext,
          currentTopic: activeTopic ? `${activeTopic.name}: ${activeTopic.description}` : 'General queries',
          studentInfo: {
            name: progress.userName || 'Beta',
            rollNumber: progress.rollNumber || '',
            stream: progress.stream || ''
          }
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
      updateActiveProfile(topics, progress, completedMsgs);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: 'error_' + Date.now(),
        sender: 'tutor',
        text: "Beta, AI server offline lag raha hai or API key limit reached. Ek baar checkout parameters please! 🔒",
        timestamp: tutorTimestamp
      };
      const completedMsgs = updatedMessages.concat(errorMsg);
      updateActiveProfile(topics, progress, completedMsgs);
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
    updateActiveProfile(topics, progress, updated);
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

    updateActiveProfile(updatedTopics, updatedProgress, updatedMessages);

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
      updateActiveProfile(updatedTopics, updatedProgress, finalMessages);
    }, 1200);
  };

  // 8. Loaded topic project into the right playground
  const handleLoadProjectInPlayground = (topic: Topic) => {
    setActiveTopicId(topic.id);
    const updatedMsgs = [...messages, {
      id: 'proj_msg_' + Date.now(),
      sender: 'tutor',
      text: `🧪 *Chapter Project Loaded:* Humne aapke liye *${topic.name}* ka experimental project loading template playground panel me setup kar diya hai.\n\nRight side par di gayi problems/scenarios ko solve karein aur code verify karne ke liye *Run Script* par click karein! All the best beta.`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }];
    updateActiveProfile(topics, progress, updatedMsgs);
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

      const successFeedbackMsg: Message = {
        id: 'success_code_' + Date.now(),
        sender: 'tutor',
        text: `🎉 *Waah Beta! Shabaash!* Aapka lab code project successfully compiled ho chuka hai bin kisi output warning ke! 
 
Main dekh rha hu aapne *${topics.find(t => t.id === topicId)?.name}* ka lab exercise sahi se crack kar liya hai. Chalo, agle level par chalte hain! 🚀`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      const finalMsgs = [...messages, successFeedbackMsg];
      updateActiveProfile(updatedTopics, updatedProgress, finalMsgs);
    }
  };

  const handleUpdateProfile = (newName: string, newRoll: string, newStream: 'B.pharm' | 'D.pharm' | '', newPic?: string, pinCode?: string) => {
    const updatedProgress = { 
      ...progress, 
      userName: newName, 
      rollNumber: newRoll, 
      stream: newStream,
      profilePic: newPic !== undefined ? newPic : progress.profilePic,
      pinCode: pinCode !== undefined ? pinCode : progress.pinCode
    };
    // Also sync back to active profile list name
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        return {
          ...p,
          progress: updatedProgress
        };
      }
      return p;
    }));
    updateActiveProfile(topics, updatedProgress, messages);
  };

  const handleClearChat = () => {
    const studentName = progress.userName;
    const defaultWelcome = studentName ? getDefaultWelcome(studentName) : getUnnamedWelcome();
    updateActiveProfile(topics, progress, defaultWelcome);
  };

  // Profile creator input form states
  const [onboardName, setOnboardName] = useState('');
  const [onboardPhone, setOnboardPhone] = useState('');
  const [onboardRoll, setOnboardRoll] = useState('');
  const [onboardStream, setOnboardStream] = useState<'B.pharm' | 'D.pharm' | ''>('B.pharm');
  const [onboardPic, setOnboardPic] = useState<string>('');
  const [onboardPin, setOnboardPin] = useState('');
  const [onboardError, setOnboardError] = useState('');
  const [paymentStep, setPaymentStep] = useState(false);
  const [upiUtr, setUpiUtr] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Secure profile switching and app-lock states
  const [switchProfileTargetId, setSwitchProfileTargetId] = useState<string | null>(null);
  const [pinVerificationInput, setPinVerificationInput] = useState<string>('');
  const [pinVerificationError, setPinVerificationError] = useState<string>('');
  const [isProfileLocked, setIsProfileLocked] = useState<boolean>(false);

  // Multi-Profile Handlers
  const handleCreateNewProfile = (
    nameInput?: string, 
    rollInput?: string, 
    streamInput?: 'B.pharm' | 'D.pharm' | '', 
    picInput?: string,
    phoneInput?: string,
    utrInput?: string,
    pinInput?: string
  ) => {
    const finalName = nameInput?.trim() || '';
    const finalRoll = rollInput?.trim() || '';
    const finalStream = streamInput || '';
    const finalPhone = phoneInput?.trim() || '';
    const finalUtr = utrInput?.trim() || '';
    const finalPin = pinInput?.trim() || '';

    const newProg: StudentProgress = {
      userName: finalName,
      rollNumber: finalRoll,
      stream: finalStream,
      completedTopics: [],
      quizScores: {},
      currentTopicId: 'intro_python',
      joinedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      approvalStatus: finalName ? 'pending' : 'approved',
      profilePic: picInput || '',
      phoneNumber: finalPhone,
      pinCode: finalPin
    };

    const newProfile: StudentProfile = {
      id: 'profile_' + Date.now(),
      progress: newProg,
      messages: finalName ? getDefaultWelcome(finalName) : getUnnamedWelcome(),
      topicsState: INITIAL_TOPICS
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem('tutor_profiles', JSON.stringify(updatedProfiles));
    setActiveProfileId(newProfile.id);
    sessionStorage.setItem('tutor_active_profile_id', newProfile.id);

    // Dispatch WhatsApp Payment Notification & Receipt to Pawan Sir & Student
    if (finalName && finalPhone) {
      setIsVerifyingPayment(true);
      fetch("/api/notify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          phone: finalPhone,
          rollNumber: finalRoll,
          stream: finalStream,
          utr: finalUtr,
          amount: 50
        })
      })
      .then(res => res.json())
      .then(data => {
        setIsVerifyingPayment(false);
        if (data.success) {
          setNotificationToast({
            show: true,
            name: finalName,
            message: data.studentMessage,
            directLink: data.studentWaLink || data.adminWaLink
          });
        }
      })
      .catch(err => {
        setIsVerifyingPayment(false);
        console.error("Failed to trigger automated WhatsApp payment notification:", err);
        const fallbackText = `💸 *PyGuru AI Payment Notification* 🎓\n\n*Student:* ${finalName}\n*UTR/Ref:* ${finalUtr || "UPI Verified"}\n*Amount:* ₹50\n*Mobile:* +91${finalPhone}\n*Date:* ${newProg.joinedDate}\n\n*Status:* Received & Sent to your WhatsApp! 👍`;
        setNotificationToast({
          show: true,
          name: finalName,
          message: fallbackText,
          directLink: `https://wa.me/918090066349?text=${encodeURIComponent(fallbackText)}`
        });
      });
    } else if (finalName) {
      // Standard fallback for name-only profile creation
      fetch("/api/notify-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          rollNumber: finalRoll,
          stream: finalStream,
          joinedDate: newProg.joinedDate
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNotificationToast({
            show: true,
            name: finalName,
            message: data.message,
            directLink: data.directLink
          });
        }
      })
      .catch(err => {
        console.error("Failed to trigger automated WhatsApp notification:", err);
      });
    }

    // Reset input fields
    setOnboardName('');
    setOnboardPhone('');
    setOnboardRoll('');
    setOnboardStream('B.pharm');
    setOnboardPic('');
    setOnboardPin('');
    setOnboardError('');
    setPaymentStep(false);
    setUpiUtr('');
    setShowProfileModal(false);
    setActiveTab('chat');
  };

  const handleSwitchProfile = (profileId: string) => {
    const targetProf = profiles.find(p => p.id === profileId);
    if (targetProf && targetProf.progress.pinCode) {
      // Set target and display PIN validation prompt
      setSwitchProfileTargetId(profileId);
      setPinVerificationInput('');
      setPinVerificationError('');
    } else {
      setActiveProfileId(profileId);
      setShowProfileModal(false);
      setIsProfileLocked(false);
    }
  };

  const handleDeleteProfile = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      return;
    }
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem('tutor_profiles', JSON.stringify(updatedProfiles));
    
    if (activeProfileId === profileId) {
      setActiveProfileId(updatedProfiles[0].id);
      sessionStorage.setItem('tutor_active_profile_id', updatedProfiles[0].id);
    }
  };

  const handleApproveStudent = (profileId: string) => {
    setProfiles(prevProfiles => {
      const updated = prevProfiles.map(p => {
        if (p.id === profileId) {
          const updatedProgress = { ...p.progress, approvalStatus: 'approved' as const };
          if (p.id === activeProfileId) {
            setProgress(updatedProgress);
          }
          return { ...p, progress: updatedProgress };
        }
        return p;
      });
      localStorage.setItem('tutor_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRejectStudent = (profileId: string) => {
    setProfiles(prevProfiles => {
      const updated = prevProfiles.map(p => {
        if (p.id === profileId) {
          const updatedProgress = { ...p.progress, approvalStatus: 'rejected' as const };
          if (p.id === activeProfileId) {
            setProgress(updatedProgress);
          }
          return { ...p, progress: updatedProgress };
        }
        return p;
      });
      localStorage.setItem('tutor_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const handleTogglePermission = (profileId: string, permissionKey: 'syllabusAllowed' | 'labsAllowed' | 'certAllowed' | 'pharmaAllowed') => {
    setProfiles(prevProfiles => {
      const updated = prevProfiles.map(p => {
        if (p.id === profileId) {
          const currentValue = p.progress[permissionKey] !== false; // defaults to true if undefined
          const updatedProgress = {
            ...p.progress,
            [permissionKey]: !currentValue
          };
          if (p.id === activeProfileId) {
            setProgress(updatedProgress);
          }
          return { ...p, progress: updatedProgress };
        }
        return p;
      });
      localStorage.setItem('tutor_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateStudentPin = (profileId: string, newPin: string) => {
    setProfiles(prevProfiles => {
      const updated = prevProfiles.map(p => {
        if (p.id === profileId) {
          const updatedProgress = {
            ...p.progress,
            pinCode: newPin || undefined
          };
          if (p.id === activeProfileId) {
            setProgress(updatedProgress);
          }
          return { ...p, progress: updatedProgress };
        }
        return p;
      });
      localStorage.setItem('tutor_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAdminDeleteStudent = (profileId: string) => {
    if (profiles.length <= 1) {
      return;
    }
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem('tutor_profiles', JSON.stringify(updatedProfiles));
    
    if (activeProfileId === profileId) {
      setActiveProfileId(updatedProfiles[0].id);
      sessionStorage.setItem('tutor_active_profile_id', updatedProfiles[0].id);
    }
  };

  const handleAdminDeleteAllStudents = () => {
    const newProg: StudentProgress = {
      userName: '',
      completedTopics: [],
      quizScores: {},
      currentTopicId: 'intro_python',
      joinedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    const defaultProfile: StudentProfile = {
      id: 'profile_' + Date.now(),
      progress: newProg,
      messages: getUnnamedWelcome(),
      topicsState: INITIAL_TOPICS
    };
    const updatedProfiles = [defaultProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem('tutor_profiles', JSON.stringify(updatedProfiles));
    setActiveProfileId(defaultProfile.id);
    sessionStorage.setItem('tutor_active_profile_id', defaultProfile.id);
  };

  // Calculate current progress count
  const completedCount = progress.completedTopics.length;
  const totalCount = topics.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-50 to-indigo-100/10 flex flex-col font-sans selection:bg-indigo-500/20">
      {/* Top Banner Branding Header */}
      <header className="bg-white/75 backdrop-blur-md border-b border-slate-200/40 sticky top-0 z-20 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-violet-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/15">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-950 via-violet-900 to-slate-900 tracking-tight text-xl sm:text-2xl leading-none">
                  PyGuru AI
                </h1>
                <span className="bg-indigo-50/70 text-indigo-700 border border-indigo-100/80 font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Hinglish 🇮🇳
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-bold mt-1">
                Bilingual Support: Hindi + English Active (Mr. Pawan Pandey)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Student Profile Switcher Selector */}
            <button 
              id="profile-switcher-btn"
              onClick={() => {
                setOnboardName('');
                setOnboardRoll('');
                setOnboardStream('B.pharm');
                setOnboardError('');
                setShowProfileModal(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-indigo-100/30 hover:from-indigo-100 hover:to-indigo-200/30 border border-indigo-100 px-4 py-2 rounded-2xl text-slate-800 text-xs font-bold transition-all shadow-xs group cursor-pointer"
            >
              <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold shadow-sm shadow-indigo-600/30">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-none">
                <span className="text-[9px] text-indigo-600 font-extrabold block tracking-wider uppercase">Active Student</span>
                <span className="text-xs font-black text-slate-800 truncate max-w-[120px] inline-block">
                  {progress.userName || "Unnamed Student 👥"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all ml-1" />
            </button>

            {/* Pawan Sir's Admin Control Panel Button */}
            <button
              onClick={() => setShowAdminPanel(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100/30 hover:from-amber-100 hover:to-amber-200/30 border border-amber-100 px-4 py-2 rounded-2xl text-slate-800 text-xs font-bold transition-all shadow-xs group cursor-pointer"
            >
              <div className="w-6 h-6 bg-amber-600 rounded-lg flex items-center justify-center text-white font-extrabold shadow-sm shadow-amber-600/30">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-none">
                <span className="text-[9px] text-amber-600 font-extrabold block tracking-wider uppercase">Pawan Sir Only</span>
                <span className="text-xs font-black text-slate-800">
                  Admin Panel 🔑
                </span>
              </div>
            </button>

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
        </div>
      </header>

      {/* Main Responsive Grid Layout Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column Dashboard Container: Handles Chat, Syllabus list, and Report cards (7 cols) */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6 relative z-10">
          
          {/* Navigation Bar Selector */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 border border-slate-200/50 shadow-xs flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-950 hover:scale-[1.01]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Tutor AI 📱
            </button>
 
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                activeTab === 'syllabus'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-950 hover:scale-[1.01]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Syllabus Path 📚</span>
              {(progress.approvalStatus !== 'approved' || progress.syllabusAllowed === false) && (
                <span className="text-[10px] bg-rose-500 text-white px-1 py-0.5 rounded-md text-xs leading-none">🔒</span>
              )}
            </button>
 
            <button
              onClick={() => setActiveTab('labs')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                activeTab === 'labs'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-950 hover:scale-[1.01]'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Labs Library 🧪</span>
              {(progress.approvalStatus !== 'approved' || progress.labsAllowed === false) && (
                <span className="text-[10px] bg-rose-500 text-white px-1 py-0.5 rounded-md text-xs leading-none">🔒</span>
              )}
            </button>
 
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                activeTab === 'progress'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-950 hover:scale-[1.01]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>My Certificate 🏆</span>
              {(progress.approvalStatus !== 'approved' || progress.certAllowed === false) && (
                <span className="text-[10px] bg-rose-500 text-white px-1 py-0.5 rounded-md text-xs leading-none">🔒</span>
              )}
            </button>

            <button
              id="tab-videos-btn"
              onClick={() => setActiveTab('videos')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-950 hover:scale-[1.01]'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Vault 🎥</span>
              {progress.approvalStatus !== 'approved' && (
                <span className="text-[10px] bg-rose-500 text-white px-1 py-0.5 rounded-md text-xs leading-none">🔒</span>
              )}
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
                onClearChat={handleClearChat}
                approvalStatus={progress.approvalStatus}
                tutorPhoto={tutorPhoto}
                onRegisterClick={() => {
                  setOnboardName('');
                  setOnboardRoll('');
                  setOnboardStream('B.pharm');
                  setOnboardError('');
                  setShowProfileModal(true);
                }}
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
                approvalStatus={progress.approvalStatus}
                syllabusAllowed={progress.syllabusAllowed}
                activeVideo={activeLectureVideo}
                activeVideoUrl={activeLectureVideoUrl}
                onCloseVideo={() => {
                  setActiveLectureVideo(null);
                  setActiveLectureVideoUrl('');
                }}
              />
            )}

            {activeTab === 'labs' && (
              <LabLibraryView
                completedLabs={progress.completedLabs || []}
                attemptedLabs={progress.attemptedLabs || []}
                labSubmissions={progress.labSubmissions || {}}
                onMarkLabComplete={handleMarkLabComplete}
                onMarkLabAttempted={handleMarkLabAttempted}
                onSaveLabSubmission={handleSaveLabSubmission}
                onLoadCodeInPlayground={(code) => {
                  const event = new CustomEvent('load-code-to-playground', { detail: code });
                  window.dispatchEvent(event);
                }}
                studentName={progress.userName || 'Beta'}
                studentStream={progress.stream || 'B.pharm'}
                customLabs={customLabs}
                onAddCustomLab={handleAddCustomLab}
                onEditCustomLab={handleEditCustomLab}
                onDeleteCustomLab={handleDeleteCustomLab}
                approvalStatus={progress.approvalStatus}
                labsAllowed={progress.labsAllowed}
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

            {activeTab === 'videos' && (
              <VideoLecturesView
                approvalStatus={progress.approvalStatus}
                activeVideo={activeLectureVideo}
                activeVideoUrl={activeLectureVideoUrl}
                onPlayVideo={(video, url) => {
                  setActiveLectureVideo(video);
                  setActiveLectureVideoUrl(url);
                  setActiveTab('syllabus');
                }}
                onCloseVideo={() => {
                  setActiveLectureVideo(null);
                  setActiveLectureVideoUrl('');
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
              approvalStatus={progress.approvalStatus}
              pharmaAllowed={progress.pharmaAllowed}
            />
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[11px] text-slate-400 shrink-0 font-medium">
        Designed for Google AI Studio Build. Practice safe coding beta. 🔒
      </footer>

      {/* Profiles Management & Multi-Student Switcher Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn text-left">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">Manage Student Profiles 👥</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">Active classroom ke students switch or manage karein beta</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {switchProfileTargetId ? (
                // SWITCH PIN VERIFICATION PANEL
                <div className="max-w-md mx-auto py-8 text-center space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm mx-auto">
                    <Lock className="w-7 h-7 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-black text-sm">Security PIN Required 🔒</h4>
                    <p className="text-slate-500 text-xs mt-1 font-semibold">
                      Beta, <span className="font-extrabold text-indigo-600">"{profiles.find(p => p.id === switchProfileTargetId)?.progress.userName}"</span> ke private chat box ko unlock karne ke liye apna 4-digit security PIN enter karein:
                    </p>
                  </div>
                  
                  <div className="max-w-xs mx-auto space-y-3">
                    <input 
                      type="password"
                      maxLength={4}
                      value={pinVerificationInput}
                      onChange={(e) => {
                        setPinVerificationInput(e.target.value.replace(/\D/g, ''));
                        setPinVerificationError('');
                      }}
                      placeholder="••••"
                      className="w-full text-center py-3 text-lg bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-mono font-extrabold tracking-[1em] text-slate-850"
                      autoFocus
                    />
                    {pinVerificationError && (
                      <p className="text-rose-600 font-extrabold text-[11px] leading-relaxed animate-pulse">
                        ⚠️ {pinVerificationError}
                      </p>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button"
                        onClick={() => {
                          setSwitchProfileTargetId(null);
                          setPinVerificationInput('');
                          setPinVerificationError('');
                        }}
                        className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const targetProf = profiles.find(p => p.id === switchProfileTargetId);
                          if (targetProf) {
                            if (targetProf.progress.pinCode === pinVerificationInput) {
                              setActiveProfileId(switchProfileTargetId);
                              setSwitchProfileTargetId(null);
                              setPinVerificationInput('');
                              setPinVerificationError('');
                              setShowProfileModal(false);
                              setIsProfileLocked(false);
                            } else {
                              setPinVerificationError('Galat PIN hai beta! Kripya sahi PIN enter karein.');
                            }
                          }
                        }}
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                      >
                        Unlock Profile 🔑
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Profile Selection List */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">All Student Profiles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profiles.map(p => {
                    const isActive = p.id === activeProfileId;
                    const completionCount = p.progress.completedTopics.length;
                    const percent = Math.round((completionCount / INITIAL_TOPICS.length) * 100);

                    return (
                      <div 
                        key={p.id}
                        onClick={() => handleSwitchProfile(p.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-36 relative ${
                          isActive 
                            ? 'bg-indigo-50/50 border-indigo-300 shadow-md shadow-indigo-600/5 ring-1 ring-indigo-300' 
                            : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          {/* Student Initial badge */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {p.progress.profilePic ? (
                                <img 
                                  src={p.progress.profilePic} 
                                  alt={p.progress.userName} 
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                                />
                              ) : (
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black uppercase ${
                                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {p.progress.userName ? p.progress.userName[0] : '?'}
                                </div>
                              )}
                              <span className="text-xs font-black text-slate-800 line-clamp-1 max-w-[120px]">
                                {p.progress.userName || "Unnamed Guest 👥"}
                              </span>
                              {p.progress.pinCode && (
                                <span className="text-[10px]" title="Private Profile: Security PIN Protected">🔐</span>
                              )}
                            </div>
                            
                            {/* Delete button (only show if profiles length > 1) */}
                            {profiles.length > 1 && (
                              <button
                                onClick={(e) => handleDeleteProfile(p.id, e)}
                                className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all animate-none"
                                title="Delete student profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Roll & Stream details */}
                          <div className="mt-2.5 space-y-1">
                            <p className="text-[10px] text-slate-400 font-bold">
                              Stream: <span className="text-slate-600">{p.progress.stream || "General Python"}</span>
                            </p>
                            {p.progress.rollNumber && (
                              <p className="text-[10px] text-slate-400 font-bold">
                                Roll: <span className="font-mono text-slate-600">{p.progress.rollNumber}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Progress Meter bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 mb-1">
                            <span>Syllabus: {percent}%</span>
                            <span>{completionCount}/{INITIAL_TOPICS.length} Chapters</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${percent}%` }} />
                          </div>
                        </div>

                        {isActive && (
                          <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Profile Creation Form section */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                      <Plus className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      {paymentStep ? "Step 2: Pay Registration Fee" : "Add New Student Profile"}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-slate-500 tracking-wider">
                    <span>{paymentStep ? "Step 2 of 2" : "Step 1 of 2"}</span>
                  </div>
                </div>

                {onboardError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-bold leading-relaxed flex items-center gap-2 animate-pulse">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{onboardError}</span>
                  </div>
                )}

                {!paymentStep ? (
                  // STEP 1: FILL DETAILS
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Photo Upload Area */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Student Photo (Optional) 📸</label>
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-dashed border-slate-200 p-4 rounded-xl hover:bg-slate-100/50 transition-all">
                        <div className="relative">
                          {onboardPic ? (
                            <img 
                              src={onboardPic} 
                              alt="Student preview" 
                              className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-slate-200/60 border border-slate-300 flex items-center justify-center text-slate-400">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-1">
                          <p className="text-xs font-black text-slate-700">Computer ya mobile se photo select karein</p>
                          <p className="text-[10px] text-slate-450 leading-relaxed font-bold">
                            Drag and drop karein ya select karein (Saved locally)
                          </p>
                          <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                            <input 
                              type="file" 
                              id="onboard-profile-pic" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setOnboardPic(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label 
                              htmlFor="onboard-profile-pic" 
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-extrabold rounded-lg cursor-pointer transition-all border border-slate-200 shadow-xs"
                            >
                              Choose Photo
                            </label>
                            {onboardPic && (
                              <button 
                                type="button"
                                onClick={() => setOnboardPic('')} 
                                className="px-2.5 py-1.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100 transition-all cursor-pointer"
                              >
                                Remove Photo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Student Full Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Kumar"
                        value={onboardName}
                        onChange={(e) => {
                          setOnboardName(e.target.value);
                          if (onboardError) setOnboardError('');
                        }}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">WhatsApp Mobile Number <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. 8090066349"
                        value={onboardPhone}
                        onChange={(e) => {
                          setOnboardPhone(e.target.value.replace(/\D/g, ''));
                          if (onboardError) setOnboardError('');
                        }}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white font-mono font-bold text-slate-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-500 block">Roll Number (Auto-Assigned CBID) 🤖</label>
                      <input
                        type="text"
                        disabled
                        value={getNextCbid()}
                        className="w-full px-3.5 py-2.5 text-xs bg-indigo-50/50 border border-indigo-100 rounded-xl font-mono text-indigo-700 font-extrabold transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Study Stream</label>
                      <select
                        value={onboardStream}
                        onChange={(e) => setOnboardStream(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 cursor-pointer transition-all"
                      >
                        <option value="B.pharm">B.pharm (Bachelor of Pharmacy)</option>
                        <option value="D.pharm">D.pharm (Diploma in Pharmacy)</option>
                        <option value="">General Python / Science student</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-extrabold tracking-wider text-rose-500 block">Set 4-Digit Security PIN <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="e.g. 1234"
                        value={onboardPin}
                        onChange={(e) => {
                          setOnboardPin(e.target.value.replace(/\D/g, ''));
                          if (onboardError) setOnboardError('');
                        }}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white font-mono font-bold tracking-widest text-center text-slate-850 transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!onboardName.trim()) {
                            setOnboardError("Kripya student ka full name enter karein!");
                            return;
                          }
                          if (!onboardPhone || onboardPhone.length < 10) {
                            setOnboardError("Kripya valid 10-digit WhatsApp number enter karein payment notification slip pane ke liye!");
                            return;
                          }
                          if (!onboardPin || onboardPin.length < 4) {
                            setOnboardError("Kripya student account security ke liye apna 4-digit Security PIN set karein!");
                            return;
                          }
                          setOnboardError("");
                          setPaymentStep(true);
                        }}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-indigo-600/20 hover:scale-[1.01] transition-all cursor-pointer text-center"
                      >
                        Proceed to Payment (₹50) ➡️
                      </button>
                    </div>
                  </div>
                ) : (
                  // STEP 2: UPI PAYMENT SCREEN
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-center animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="text-left">
                        <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wide">Payee Address</span>
                        <h5 className="text-xs font-black text-slate-800">8090066349@ybl</h5>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wide">Amount Due</span>
                        <h5 className="text-xs font-black text-emerald-600">₹50.00 INR</h5>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl inline-block shadow-sm relative overflow-hidden group">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          `upi://pay?pa=8090066349@ybl&pn=PyGuru%20AI%20Python%20Classes&am=50.00&cu=INR&tn=Reg%20for%2520${encodeURIComponent(onboardName)}`
                        )}`} 
                        alt="UPI QR Code"
                        referrerPolicy="no-referrer"
                        className="w-48 h-48 mx-auto"
                      />
                      <div className="mt-2 flex items-center justify-center gap-1 bg-slate-50 border border-slate-100 rounded-lg py-1 px-2 text-[9px] font-bold text-slate-500">
                        <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.9L10 .9l7.834 4M2 14v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1M4 7v7m3-7v7m3-7v7m3-7v7" clipRule="evenodd" />
                        </svg>
                        <span>8090066349@ybl</span>
                      </div>
                    </div>

                    <div className="space-y-1 max-w-sm mx-auto text-center">
                      <p className="text-xs text-slate-700 font-extrabold">
                        Scan with GPay, PhonePe, Paytm, or any BHIM UPI App 📱
                      </p>
                      <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                        Aapke mobile screen par upar diya gaya QR code scan karein aur ₹50 ka registration transaction complete karein. Payment success hone ke baad, neechhe *UPI Transaction ID (UTR / Ref ID)* dalkar complete karein!
                      </p>
                    </div>

                    <div className="space-y-1.5 max-w-xs mx-auto text-left border-t border-slate-200 pt-3">
                      <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 block text-center">
                        UPI Transaction ID (12-digit UTR No.) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="e.g. 312456789012"
                        value={upiUtr}
                        onChange={(e) => {
                          setUpiUtr(e.target.value.replace(/\D/g, ''));
                          if (onboardError) setOnboardError('');
                        }}
                        className="w-full text-center px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono font-bold tracking-widest text-slate-800 transition-all"
                      />
                    </div>

                    <div className="flex gap-2 max-w-sm mx-auto pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentStep(false);
                          setOnboardError("");
                        }}
                        className="w-1/3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                      >
                        ⬅️ Edit
                      </button>
                      <button
                        type="button"
                        disabled={isVerifyingPayment}
                        onClick={() => {
                          if (!upiUtr || upiUtr.length < 12) {
                            setOnboardError("Kripya payment verification ke liye valid 12-digit UPI UTR / Transaction ID fill karein!");
                            return;
                          }
                          setOnboardError("");
                          handleCreateNewProfile(onboardName, getNextCbid(), onboardStream, onboardPic, onboardPhone, upiUtr, onboardPin);
                        }}
                        className={`flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider shadow-md hover:shadow-emerald-600/20 transition-all cursor-pointer text-center ${
                          isVerifyingPayment ? 'opacity-70 cursor-wait animate-pulse' : ''
                        }`}
                      >
                        {isVerifyingPayment ? "Sending Slip... ⏳" : "Verify & Complete Profile 🚀"}
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-[9px] text-slate-400 leading-relaxed italic text-center pt-2">
                  ℹ️ **Security Note:** Aapka payment 100% secure hai aur confirmation notification seedhe aapke WhatsApp mobile number (+91 {onboardPhone || 'XXXXXXXXXX'}) par aur Pawan Sir (PyGuru Coordinator) ke dashboard par instant notify ho jayega. 👍
                </p>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {showAdminPanel && (
        <AdminPanel
          profiles={profiles}
          onApproveStudent={handleApproveStudent}
          onRejectStudent={handleRejectStudent}
          onDeleteStudent={handleAdminDeleteStudent}
          onDeleteAllStudents={handleAdminDeleteAllStudents}
          onTogglePermission={handleTogglePermission}
          onUpdateStudentPin={handleUpdateStudentPin}
          tutorPhoto={tutorPhoto}
          onUpdateTutorPhoto={handleUpdateTutorPhoto}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* Abuse/Mannerless Language Detected Warning Block Modal */}
      {showAbuseWarning && (
        <div className="fixed inset-0 bg-rose-950/80 backdrop-blur-md flex items-center justify-center z-[80] p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border-4 border-rose-600 p-6 max-w-md w-full shadow-2xl space-y-5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />
            <div className="w-16 h-16 bg-rose-100 text-rose-600 border-2 border-rose-200 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-extrabold text-rose-600 text-lg uppercase tracking-tight">🚨 Warning: Account Blocked!</h4>
              <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Mannerless / Abusive Content Detected</p>
              
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-left space-y-2.5 mt-2">
                <p className="text-xs text-rose-950 leading-relaxed font-bold">
                  *Beta*, PyGuru AI Python Tutor program me *abusive, mannerless, ya galat shabdo* ka prayog strictly forbidden hai! 🛑
                </p>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  Aapke dwara bheje gaye message me <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-lg font-mono font-black border border-rose-200">"{abuseWordDetected}"</span> shabd detect hua hai, isliye aapko block kar diya gaya hai.
                </p>
                <p className="text-[11px] text-indigo-600 leading-relaxed font-black italic">
                  👉 Ab aap tab tak chat nahi kar payenge jab tak Admin (Pawan Sir) aapke profile ko review karke 'Approved' nahi kar dete. Kripya hamesha discipline aur shishtachar banaye rakhein!
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowAbuseWarning(false);
                  setAbuseWordDetected('');
                }}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-lg shadow-rose-600/30 hover:scale-[1.01] transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                Maafi Chahta Hoon, Close 👍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Notification Alert Modal */}
      {notificationToast && notificationToast.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[70] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.457 3.415 1.257 4.862l-1.336 4.887 5.011-1.316c1.402.766 2.996 1.203 4.69 1.203 5.506 0 9.988-4.482 9.988-9.988 0-5.506-4.482-9.988-9.988-9.988zm5.725 14.154c-.244.686-1.42 1.261-1.954 1.341-.49.073-1.127.13-3.284-.755-2.76-1.134-4.522-3.95-4.66-4.135-.137-.184-1.109-1.472-1.109-2.808 0-1.337.697-1.993.945-2.251.248-.258.541-.323.722-.323.18 0 .362.002.518.009.162.008.381-.062.596.455.22.531.755 1.84.82 1.975.066.134.11.291.021.47-.09.18-.135.291-.271.451-.136.16-.285.356-.407.478-.137.136-.28.284-.12.559.16.273.71 1.171 1.523 1.895.803.713 1.48.932 1.782 1.059.301.127.48.106.66-.098.18-.204.77-.896.976-1.203.204-.307.41-.258.694-.153.282.106 1.796.847 2.104 1.002.308.155.513.232.589.362.074.13.074.755-.17 1.441z"/>
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-800 text-sm">WhatsApp Notification Sent! 🚀</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Pawan Sir (<span className="text-emerald-600 font-extrabold">8090066349</span>) ko WhatsApp notification automatic bhej di gayi hai! 
              </p>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-left text-[10px] font-mono font-semibold text-slate-600 whitespace-pre-wrap mt-2 select-all">
                {notificationToast.message}
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href={notificationToast.directLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Direct WhatsApp Par Dekhein 💬
              </a>
              <button
                onClick={() => setNotificationToast(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Theek Hai, Close 👍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Locking System Full Screen Overlay */}
      {isProfileLocked && progress.pinCode && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-8 text-center space-y-6 animate-fadeIn text-left">
            <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center text-rose-500 shadow-sm mx-auto">
              <Lock className="w-9 h-9 animate-bounce" />
            </div>
            
            <div className="space-y-2 text-center">
              <span className="bg-rose-50 text-rose-600 border border-rose-100 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                Private Chat Box Locked 🔐
              </span>
              <h2 className="text-xl font-black text-slate-800 pt-2">Access Denied: Locked Profile</h2>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Beta, is student panel <span className="font-extrabold text-indigo-600">"{progress.userName || 'Unnamed Student'}"</span> ko unlock karne ke liye apna 4-digit security PIN enter karein:
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-4">
              <input 
                type="password"
                maxLength={4}
                value={pinVerificationInput}
                onChange={(e) => {
                  setPinVerificationInput(e.target.value.replace(/\D/g, ''));
                  setPinVerificationError('');
                }}
                placeholder="••••"
                className="w-full text-center py-4 text-2xl bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-rose-500 font-mono font-extrabold tracking-[1em] text-slate-850 transition-all"
                autoFocus
              />
              {pinVerificationError && (
                <p className="text-rose-600 font-extrabold text-xs leading-relaxed text-center animate-pulse">
                  ⚠️ {pinVerificationError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => {
                    // Reset to public switcher or show profile modal
                    setShowProfileModal(true);
                    setPinVerificationInput('');
                    setPinVerificationError('');
                  }}
                  className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Switch Profile 👥
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (progress.pinCode === pinVerificationInput) {
                      setIsProfileLocked(false);
                      setPinVerificationInput('');
                      setPinVerificationError('');
                    } else {
                      setPinVerificationError('Galat PIN hai beta! Sahi PIN enter karein.');
                    }
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  Unlock Panel 🔑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
