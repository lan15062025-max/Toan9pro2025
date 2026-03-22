/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  BookOpen, 
  LayoutDashboard, 
  PenTool, 
  Settings, 
  ChevronRight, 
  GraduationCap,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowLeft,
  Filter,
  Clock,
  AlertCircle,
  MessageCircle,
  Send,
  Loader2,
  FileText,
  Lightbulb,
  Eye,
  User,
  School,
  Target,
  Award,
  History,
  UserCircle,
  Bell,
  BellOff,
  Plus,
  Trash2,
  Infinity,
  Zap,
  BarChart3,
  RotateCcw,
  Home,
  LogOut,
  Mail,
  Lock,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CHAPTERS, QUESTIONS, ESSAY_PROBLEMS, type Chapter, type Question, type EssayProblem } from './data';
import { explainTopic, chatWithAI, getLearningRecommendation } from './services/geminiService';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

type View = 'dashboard' | 'theory' | 'practice' | 'quiz' | 'ai-chat' | 'learning-path' | 'advanced-essay' | 'profile';

interface UserProfile {
  id?: number;
  email?: string;
  name: string;
  school: string;
  class: string;
  targetScore: number;
  targetSchool: string;
  avatar?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
}

interface StudyReminder {
  id: string;
  time: string;
  days: number[];
  enabled: boolean;
}

interface QuizResult {
  date: string;
  score: number;
  total: number;
  chapterId: string;
  details: {
    questionId: string;
    isCorrect: boolean;
    chapterId: string;
    level: string;
  }[];
}

interface QuizSession {
  questions: Question[];
  currentIndex: number;
  userAnswers: (number | null)[];
  score: number;
  timeLeft: number;
  isMockExam: boolean;
  chapterId: string | null;
  timestamp: number;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [authError, setAuthError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'NB' | 'TH' | 'VD'>('ALL');
  const [questionCount, setQuestionCount] = useState(10);
  const [mockQuestionCount, setMockQuestionCount] = useState(40);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isMockExam, setIsMockExam] = useState(false);
  const [isUnlimitedMode, setIsUnlimitedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [chartMetric, setChartMetric] = useState<'percentage' | 'count'>('percentage');
  const [chartLayout, setChartLayout] = useState<'vertical' | 'horizontal'>('vertical');
  
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Chào bạn! Tôi là gia sư AI Toán 9 Pro. Tôi sẽ đồng hành cùng bạn để giải quyết các bài toán khó bằng cách gợi ý từng bước để bạn tự tìm ra lời giải. Bạn đang gặp khó khăn ở bài toán nào?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const [results, setResults] = useState<QuizResult[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [savedSession, setSavedSession] = useState<QuizSession | null>(null);
  
  const [selectedEssay, setSelectedEssay] = useState<EssayProblem | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Sĩ tử 2k11',
    school: 'Trường THCS Chu Văn An',
    class: '9A1',
    targetScore: 9.0,
    targetSchool: 'THPT Chuyên Hà Nội - Amsterdam'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState<UserProfile>(userProfile);
  const [quizFilter, setQuizFilter] = useState<'ALL' | 'CORRECT' | 'INCORRECT'>('ALL');

  const filteredQuestions = useMemo(() => {
    if (quizFilter === 'ALL') return quizQuestions;
    if (quizFilter === 'CORRECT') return quizQuestions.filter((_, idx) => userAnswers[idx] === quizQuestions[idx].correctAnswer);
    return quizQuestions.filter((_, idx) => userAnswers[idx] !== quizQuestions[idx].correctAnswer);
  }, [quizQuestions, userAnswers, quizFilter]);

  const [reminders, setReminders] = useState<StudyReminder[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showAddReminder, setShowAddReminder] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [newReminderTime, setNewReminderTime] = useState('20:00');

  const knowledgeStats = useMemo(() => {
    if (!showResult || quizQuestions.length === 0) return [];
    
    const statsMap = new Map<string, { name: string, correct: number, total: number }>();
    
    quizQuestions.forEach((q, idx) => {
      const chapter = CHAPTERS.find(c => c.id === q.chapterId);
      const chapterName = chapter ? chapter.title.split(': ')[1] : 'Kiến thức khác';
      
      if (!statsMap.has(q.chapterId)) {
        statsMap.set(q.chapterId, { name: chapterName, correct: 0, total: 0 });
      }
      
      const current = statsMap.get(q.chapterId)!;
      current.total += 1;
      if (userAnswers[idx] === q.correctAnswer) {
        current.correct += 1;
      }
    });
    
    return Array.from(statsMap.values()).map(s => ({
      ...s,
      percentage: Math.round((s.correct / s.total) * 100),
      status: (s.correct / s.total) >= 0.7 ? 'Đạt' : 'Cần cố gắng'
    }));
  }, [showResult, quizQuestions, userAnswers]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
          setEditProfileForm(data);
          setIsLoggedIn(true);
          
          const resultsRes = await fetch('/api/results');
          if (resultsRes.ok) {
            const resultsData = await resultsRes.json();
            setResults(resultsData);
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkAuth();

    const session = localStorage.getItem('math9_active_session');
    if (session) {
      try {
        setSavedSession(JSON.parse(session));
      } catch (e) {
        console.error("Failed to parse saved session", e);
      }
    }

    const savedReminders = localStorage.getItem('math9_reminders');
    if (savedReminders) {
      try {
        setReminders(JSON.parse(savedReminders));
      } catch (e) {
        console.error("Failed to parse saved reminders", e);
      }
    }
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });
      const data = await res.json();
      if (res.ok) {
        setUserProfile(data);
        setEditProfileForm(data);
        setIsLoggedIn(true);
        const resultsRes = await fetch('/api/results');
        if (resultsRes.ok) {
          const resultsData = await resultsRes.json();
          setResults(resultsData);
        }
      } else {
        setAuthError(data.error);
      }
    } catch (e) {
      setAuthError('Lỗi kết nối máy chủ');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (res.ok) {
        setUserProfile(data);
        setEditProfileForm(data);
        setIsLoggedIn(true);
      } else {
        setAuthError(data.error);
      }
    } catch (e) {
      setAuthError('Lỗi kết nối máy chủ');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  const handleUpdateProfile = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProfileForm)
      });
      if (res.ok) {
        setUserProfile(editProfileForm);
        setIsEditingProfile(false);
        alert('Cập nhật hồ sơ thành công!');
      }
    } catch (e) {
      console.error("Failed to update profile", e);
      alert('Lỗi khi cập nhật hồ sơ');
    }
  };

  useEffect(() => {
    localStorage.setItem('math9_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    if (currentView === 'quiz' && !showResult) {
      const session: QuizSession = {
        questions: quizQuestions,
        currentIndex: currentQuestionIndex,
        userAnswers,
        score,
        timeLeft,
        isMockExam,
        chapterId: selectedChapter?.id || null,
        timestamp: Date.now()
      };
      localStorage.setItem('math9_active_session', JSON.stringify(session));
    } else if (showResult) {
      localStorage.removeItem('math9_active_session');
      setSavedSession(null);
    }
  }, [currentView, quizQuestions, currentQuestionIndex, userAnswers, score, timeLeft, isMockExam, showResult, selectedChapter]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentView === 'quiz' && isMockExam && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isMockExam && currentView === 'quiz' && !showResult) {
      setShowResult(true);
    }
    return () => clearInterval(timer);
  }, [currentView, isMockExam, timeLeft, showResult]);

  // Study Reminders Notification Logic
  useEffect(() => {
    const checkReminders = () => {
      if (notificationPermission !== 'granted') return;
      
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      reminders.forEach(reminder => {
        if (reminder.enabled && reminder.days.includes(currentDay) && reminder.time === currentTime) {
          const lastNotifiedKey = `math9_last_notified_${reminder.id}`;
          const lastNotified = localStorage.getItem(lastNotifiedKey);
          const todayStr = now.toDateString();
          
          if (lastNotified !== todayStr) {
            new Notification('Toán 9 Pro: Đến giờ học rồi!', {
              body: 'Hãy dành ít nhất 15 phút luyện tập hôm nay để đạt mục tiêu nhé!',
              icon: '/favicon.ico'
            });
            localStorage.setItem(lastNotifiedKey, todayStr);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders, notificationPermission]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ thông báo.');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const addReminder = () => {
    const newReminder: StudyReminder = {
      id: Math.random().toString(36).substr(2, 9),
      time: newReminderTime,
      days: [1, 2, 3, 4, 5, 6, 0], // Default all days
      enabled: true
    };
    setReminders([...reminders, newReminder]);
    setShowAddReminder(false);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExplain = async (topic: string) => {
    if (!selectedChapter) return;
    setActiveTopic(topic);
    setIsExplaining(true);
    setAiExplanation(null);
    const explanation = await explainTopic(topic, selectedChapter.title);
    setAiExplanation(explanation || "Không có phản hồi từ AI.");
    setIsExplaining(false);
  };

  const startPractice = (chapter?: Chapter, isMock: boolean = false, isUnlimited: boolean = false) => {
    let filtered = QUESTIONS;
    if (chapter) {
      filtered = filtered.filter(q => q.chapterId === chapter.id);
    }
    if (!isMock && !isUnlimited && difficultyFilter !== 'ALL') {
      filtered = filtered.filter(q => q.level === difficultyFilter);
    }
    
    if (filtered.length === 0) {
      alert('Không có câu hỏi nào phù hợp với bộ lọc này.');
      return;
    }

    let count;
    if (isUnlimited) {
      count = Math.min(10, filtered.length); // Start with 10 questions
    } else {
      count = isMock ? Math.min(mockQuestionCount, filtered.length) : Math.min(questionCount, filtered.length);
    }
    
    const selected = [...filtered]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(q => {
        // Shuffle options and update correctAnswer index
        const optionsWithIdx = q.options.map((opt, idx) => ({ opt, idx }));
        const shuffled = optionsWithIdx.sort(() => Math.random() - 0.5);
        return {
          ...q,
          options: shuffled.map(s => s.opt),
          correctAnswer: shuffled.findIndex(s => s.idx === q.correctAnswer)
        };
      });
    
    setQuizQuestions(selected);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setIsMockExam(isMock);
    setIsUnlimitedMode(isUnlimited);
    if (isMock) {
      setTimeLeft(90 * 60); // 90 minutes
    }
    setUserAnswers(new Array(selected.length).fill(null));
    setCurrentView('quiz');
    setSavedSession(null);
  };

  const resumeSession = () => {
    if (!savedSession) return;
    setQuizQuestions(savedSession.questions);
    setCurrentQuestionIndex(savedSession.currentIndex);
    setUserAnswers(savedSession.userAnswers);
    setScore(savedSession.score);
    setTimeLeft(savedSession.timeLeft);
    setIsMockExam(savedSession.isMockExam);
    if (savedSession.chapterId) {
      setSelectedChapter(CHAPTERS.find(c => c.id === savedSession.chapterId) || null);
    }
    setShowResult(false);
    setCurrentView('quiz');
    setIsAnswered(false);
    setSavedSession(null);
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
    setIsAnswered(true);

    if (optionIndex === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const finishQuiz = async () => {
    // Save result
    const answeredCount = currentQuestionIndex + 1;
    const finalQuestions = quizQuestions.slice(0, answeredCount);
    const finalAnswers = userAnswers.slice(0, answeredCount);
    
    setQuizQuestions(finalQuestions);
    setUserAnswers(finalAnswers);

    const newResult: QuizResult = {
      date: new Date().toISOString(),
      score: score,
      total: answeredCount,
      chapterId: isMockExam ? 'MOCK' : (isUnlimitedMode ? 'UNLIMITED' : (quizQuestions[0]?.chapterId || 'ALL')),
      details: finalQuestions.map((q, i) => ({
        questionId: q.id,
        isCorrect: finalAnswers[i] === q.correctAnswer,
        chapterId: q.chapterId,
        level: q.level
      }))
    };
    
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResult)
      });
      setResults(prev => [newResult, ...prev].slice(0, 50));
    } catch (e) {
      console.error("Failed to save result", e);
    }
    
    setShowResult(true);
    setIsUnlimitedMode(false);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
    } else if (isUnlimitedMode) {
      // Fetch 10 more questions
      let filtered = QUESTIONS;
      if (selectedChapter) {
        filtered = filtered.filter(q => q.chapterId === selectedChapter.id);
      }
      
      const nextBatch = [...filtered]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map(q => {
          const optionsWithIdx = q.options.map((opt, idx) => ({ opt, idx }));
          const shuffled = optionsWithIdx.sort(() => Math.random() - 0.5);
          return {
            ...q,
            options: shuffled.map(s => s.opt),
            correctAnswer: shuffled.findIndex(s => s.idx === q.correctAnswer)
          };
        });
      
      setQuizQuestions(prev => [...prev, ...nextBatch]);
      setUserAnswers(prev => [...prev, ...new Array(nextBatch.length).fill(null)]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    const history = chatMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await chatWithAI(userMsg, history);
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsChatting(false);
  };

  const generateLearningPath = async () => {
    if (results.length === 0) return;
    setIsGeneratingPath(true);
    setCurrentView('learning-path');

    // Calculate stats
    const chapterStats: Record<string, { correct: number, total: number }> = {};
    const levelStats: Record<string, { correct: number, total: number }> = {};

    results.forEach(res => {
      res.details.forEach(detail => {
        if (!chapterStats[detail.chapterId]) chapterStats[detail.chapterId] = { correct: 0, total: 0 };
        if (!levelStats[detail.level]) levelStats[detail.level] = { correct: 0, total: 0 };
        
        chapterStats[detail.chapterId].total++;
        levelStats[detail.level].total++;
        if (detail.isCorrect) {
          chapterStats[detail.chapterId].correct++;
          levelStats[detail.level].correct++;
        }
      });
    });

    const statsString = `
      Thống kê theo chương:
      ${Object.entries(chapterStats).map(([id, s]) => `- ${CHAPTERS.find(c => c.id === id)?.title || id}: ${s.correct}/${s.total} (${Math.round(s.correct/s.total*100)}%)`).join('\n')}
      
      Thống kê theo mức độ:
      ${Object.entries(levelStats).map(([lvl, s]) => `- ${lvl}: ${s.correct}/${s.total} (${Math.round(s.correct/s.total*100)}%)`).join('\n')}
    `;

    const rec = await getLearningRecommendation(statsString);
    setRecommendation(rec);
    setIsGeneratingPath(false);
  };

  const askAIAboutQuestion = (question: Question) => {
    setCurrentView('ai-chat');
    const prompt = `Tôi đang gặp khó khăn với câu hỏi này. Hãy giúp tôi tư duy để tìm ra lời giải từng bước một (đừng cho tôi đáp án ngay).
Câu hỏi: ${question.text}
Các lựa chọn:
${question.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}
Đáp án đúng: ${question.options[question.correctAnswer]}
${question.explanation ? `Giải thích hiện tại: ${question.explanation}` : ''}`;
    
    setChatMessages(prev => [...prev, { role: 'user', text: prompt }]);
    handleSendMessageFromPrompt(prompt);
  };

  const handleSendMessageFromPrompt = async (prompt: string) => {
    setIsChatting(true);
    const history = chatMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));
    const response = await chatWithAI(prompt, history);
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsChatting(false);
  };

  useEffect(() => {
    if (showResult && score >= quizQuestions.length * 0.7) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [showResult, score, quizQuestions.length]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-200"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800">Toán 9 Pro</h1>
            <p className="text-slate-500 text-sm">Chinh phục kỳ thi vào 10 cùng AI</p>
          </div>

          <div className="flex gap-2 mb-8 p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setAuthView('login')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authView === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => setAuthView('register')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authView === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={authView === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {authView === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Họ và tên</label>
                <div className="relative mt-1">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  placeholder="hocsinh@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Mật khẩu</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl text-xs font-medium border border-rose-100">
                <AlertCircle size={14} />
                {authError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 mt-4"
            >
              {authView === 'login' ? 'Đăng nhập ngay' : 'Tạo tài khoản'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar / Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white p-4 md:top-0 md:bottom-auto md:left-0 md:h-screen md:w-64 md:flex-col md:justify-start md:gap-8 md:border-r md:border-t-0">
        <div className="hidden flex-col gap-1 md:flex">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Toán 9 Pro</span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 pl-1">Phát triển bởi cô Phan Lan</span>
        </div>

        <div className="flex w-full items-center justify-around md:flex-col md:items-start md:gap-2">
          <NavItem 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Tổng quan"
          />
          <NavItem 
            active={currentView === 'theory'} 
            onClick={() => setCurrentView('theory')}
            icon={<BookOpen size={20} />}
            label="Kiến thức"
          />
          <NavItem 
            active={currentView === 'practice' || currentView === 'quiz'} 
            onClick={() => setCurrentView('practice')}
            icon={<PenTool size={20} />}
            label="Luyện tập"
          />
          <NavItem 
            active={currentView === 'advanced-essay'} 
            onClick={() => setCurrentView('advanced-essay')}
            icon={<FileText size={20} />}
            label="Toán nâng cao"
          />
          <NavItem 
            active={currentView === 'ai-chat'} 
            onClick={() => setCurrentView('ai-chat')}
            icon={<MessageCircle size={20} />}
            label="Hỏi đáp AI"
          />
          <NavItem 
            active={currentView === 'learning-path'} 
            onClick={generateLearningPath}
            icon={<Trophy size={20} />}
            label="Lộ trình"
          />
          <NavItem 
            active={currentView === 'profile'} 
            onClick={() => setCurrentView('profile')}
            icon={<User size={20} />}
            label="Hồ sơ"
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-24 md:pl-64 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 px-4 py-3 md:px-6 md:py-4 backdrop-blur-md">
          <div className="mx-auto max-w-5xl flex items-center justify-between">
            <div>
              <h1 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
                {currentView === 'dashboard' && 'Bảng điều khiển'}
                {currentView === 'theory' && 'Hệ thống kiến thức'}
                {currentView === 'practice' && 'Kho câu hỏi'}
                {currentView === 'advanced-essay' && 'Toán nâng cao tự luận'}
                {currentView === 'quiz' && 'Đang làm bài'}
                {currentView === 'ai-chat' && 'Hỏi đáp AI'}
                {currentView === 'learning-path' && 'Lộ trình học tập'}
                {currentView === 'profile' && 'Hồ sơ học sinh'}
              </h1>
              <p className="text-[9px] font-bold text-slate-400 md:hidden uppercase tracking-wider">Cô Phan Lan • Toán 9 Pro</p>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden text-sm font-bold text-slate-500 md:block">
                Chào mừng, {userProfile.name}
              </div>
              <button 
                onClick={() => setCurrentView('profile')}
                className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-all active:scale-90"
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl p-6">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Learning Path Promo */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-200">
                    <div className="relative z-10">
                      <h2 className="mb-2 text-2xl font-bold">Lộ trình học tập cá nhân hóa</h2>
                      <p className="mb-6 text-indigo-100 opacity-90">
                        Dựa trên kết quả làm bài, AI sẽ đề xuất những phần kiến thức bạn cần tập trung nhất để bứt phá điểm số.
                      </p>
                      <button 
                        onClick={generateLearningPath}
                        disabled={results.length === 0}
                        className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-indigo-600 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {results.length === 0 ? 'Làm bài để xem lộ trình' : 'Xem lộ trình của tôi'}
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                  </div>

                  <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <User size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-800">Chào mừng, {userProfile.name}!</h2>
                          <p className="text-sm text-slate-500">{userProfile.class} • {userProfile.school}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Mục tiêu:</span>
                          <span className="font-bold text-indigo-600">{userProfile.targetScore} điểm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Trường:</span>
                          <span className="font-bold text-slate-700">{userProfile.targetSchool}</span>
                        </div>
                        <button 
                          onClick={() => setCurrentView('profile')}
                          className="w-full mt-2 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        >
                          Chỉnh sửa hồ sơ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Session Alert */}
                {savedSession && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">Bạn có bài làm chưa hoàn thành</h3>
                        <p className="text-sm text-slate-500">
                          {savedSession.isMockExam ? 'Đề thi thử' : `Luyện tập: ${CHAPTERS.find(c => c.id === savedSession.chapterId)?.title || 'Tổng hợp'}`} - Câu {savedSession.currentIndex + 1}/{savedSession.questions.length}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          localStorage.removeItem('math9_active_session');
                          setSavedSession(null);
                        }}
                        className="rounded-xl px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600"
                      >
                        Bỏ qua
                      </button>
                      <button 
                        onClick={resumeSession}
                        className="rounded-xl bg-amber-500 px-6 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-600 active:scale-95"
                      >
                        Tiếp tục làm bài
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* QR Code Section - Optimized for Mobile */}
                <section>
                  <div className="rounded-3xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-6 md:p-8 shadow-xl shadow-indigo-100/20">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
                      <div className="max-w-xl space-y-4 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-200">
                          <Zap size={12} fill="currentColor" />
                          Tính năng mới
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                          Học tập mọi lúc, <br className="hidden md:block" />
                          <span className="text-indigo-600">mọi nơi cùng bạn bè!</span>
                        </h2>
                        <p className="text-slate-600 text-sm md:text-lg leading-relaxed">
                          Quét mã QR để mở ứng dụng trên điện thoại di động. Chia sẻ link cho bạn bè để cùng nhau thi đua.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText('https://ais-pre-iywqjufbmnbqmrmwotuvns-63045081713.asia-southeast1.run.app');
                              alert('Đã sao chép link ứng dụng!');
                            }}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
                          >
                            <Plus size={18} />
                            Sao chép link chia sẻ
                          </button>
                        </div>
                      </div>
                      <div className="relative group w-full max-w-[280px] md:max-w-none">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[40px] opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" />
                        <div className="relative flex flex-col items-center gap-4 rounded-[32px] bg-white p-6 md:p-8 shadow-2xl border border-slate-100">
                          <QRCodeCanvas 
                            value="https://ais-pre-iywqjufbmnbqmrmwotuvns-63045081713.asia-southeast1.run.app" 
                            size={180}
                            level="H"
                            includeMargin={true}
                            className="w-full h-auto max-w-[180px]"
                            imageSettings={{
                              src: "https://ais-dev-iywqjufbmnbqmrmwotuvns-63045081713.asia-southeast1.run.app/favicon.ico",
                              x: undefined,
                              y: undefined,
                              height: 32,
                              width: 32,
                              excavate: true,
                            }}
                          />
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Quét để học ngay</span>
                            <span className="text-[9px] font-medium text-slate-400">Tương thích Android & iOS</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Hero Stats */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <StatCard 
                    title="Tiến độ học tập" 
                    value={`${Math.round((results.filter(r => r.chapterId !== 'MOCK' && r.chapterId !== 'ALL').length / CHAPTERS.length) * 100)}%`} 
                    subtitle={`Đã luyện tập ${new Set(results.filter(r => r.chapterId !== 'MOCK' && r.chapterId !== 'ALL').map(r => r.chapterId)).size}/${CHAPTERS.length} chương`}
                    color="bg-blue-500"
                  />
                  <StatCard 
                    title="Câu hỏi đã làm" 
                    value={results.reduce((acc, res) => acc + res.total, 0).toString()} 
                    subtitle={`Tổng cộng ${results.length} bài luyện tập`}
                    color="bg-emerald-500"
                  />
                  <StatCard 
                    title="Tỷ lệ chính xác" 
                    value={`${results.reduce((acc, res) => acc + res.total, 0) > 0 ? Math.round((results.reduce((acc, res) => acc + res.score, 0) / results.reduce((acc, res) => acc + res.total, 0)) * 100) : 0}%`} 
                    subtitle="Dựa trên tất cả bài làm"
                    color="bg-amber-500"
                  />
                </div>

                {/* Chapters List */}
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Chương trình học</h2>
                    <button className="text-sm font-medium text-indigo-600 hover:underline">Xem tất cả</button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {CHAPTERS.map((chapter) => (
                      <ChapterCard 
                        key={chapter.id} 
                        chapter={chapter} 
                        onClick={() => {
                          setSelectedChapter(chapter);
                          setCurrentView('theory');
                        }}
                      />
                    ))}
                  </div>
                </section>

                {/* Advanced Math Promo */}
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Thử thách nâng cao</h2>
                    <button 
                      onClick={() => setCurrentView('advanced-essay')}
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      Xem tất cả
                    </button>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                          <FileText size={28} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Toán tự luận nâng cao</h3>
                          <p className="text-sm text-slate-500">Chinh phục các dạng toán khó, bứt phá điểm 9, 10 trong kỳ thi vào 10.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setCurrentView('advanced-essay')}
                        className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95"
                      >
                        Thử sức ngay
                      </button>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {currentView === 'theory' && (
              <motion.div
                key="theory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-bold text-slate-800">Tóm tắt kiến thức</h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-1 space-y-2">
                    {CHAPTERS.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => setSelectedChapter(chapter)}
                        className={`w-full rounded-xl p-4 text-left transition-all ${
                          selectedChapter?.id === chapter.id 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                            : "bg-white border border-slate-200 hover:border-indigo-300"
                        }`}
                      >
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-70">Chương {chapter.id.replace('ch', '')}</div>
                        <div className="font-bold line-clamp-1">{chapter.title.split(': ')[1]}</div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="lg:col-span-2">
                    {selectedChapter ? (
                      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h3 className="mb-4 text-2xl font-bold text-slate-800">{selectedChapter.title}</h3>
                        <p className="mb-6 text-slate-600 leading-relaxed">{selectedChapter.summary}</p>
                        
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-indigo-500" />
                            Các chủ đề trọng tâm (Click để xem giải thích AI):
                          </h4>
                          <ul className="grid gap-3 sm:grid-cols-2">
                            {selectedChapter.topics.map((topic, i) => (
                              <li key={i}>
                                <button 
                                  onClick={() => handleExplain(topic)}
                                  className={`w-full flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all text-left ${
                                    activeTopic === topic ? "bg-indigo-50 border-indigo-200 border" : "bg-slate-50 border border-transparent hover:border-indigo-200"
                                  }`}
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-indigo-600 shadow-sm border border-slate-100">
                                    {i + 1}
                                  </span>
                                  {topic}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* AI Explanation Section */}
                        {(isExplaining || aiExplanation) && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-2xl bg-white p-6 border-2 border-indigo-100 shadow-xl shadow-indigo-50"
                          >
                            <div className="mb-6 flex items-center justify-between border-b border-indigo-50 pb-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                                  <GraduationCap size={20} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800">Gia sư AI</h4>
                                  <p className="text-xs font-medium text-slate-500">Đang giải thích: {activeTopic}</p>
                                </div>
                              </div>
                              {isExplaining && (
                                <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-600" />
                                  Đang soạn bài...
                                </div>
                              )}
                            </div>
                            
                            {aiExplanation ? (
                              <div className="markdown-body prose prose-indigo max-w-none text-slate-700">
                                <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                  {aiExplanation}
                                </Markdown>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                                <p className="text-sm font-medium">Đang kết nối với trí tuệ nhân tạo...</p>
                              </div>
                            )}
                          </motion.div>
                        )}

                        <div className="mt-8 flex gap-4">
                          <button 
                            onClick={() => startPractice(selectedChapter)}
                            className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-transform active:scale-95"
                          >
                            Luyện tập ngay
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                        Chọn một chương để xem kiến thức
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

              {currentView === 'practice' && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Student Profile Summary in Practice */}
                <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-inner">
                      <UserCircle size={40} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{userProfile.name}</h3>
                      <p className="text-xs font-medium text-slate-500">{userProfile.class} • {userProfile.school}</p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Trophy size={10} /> Bạc II
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {results.length} bài đã làm
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentView('profile')}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Xem hồ sơ chi tiết
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[32px] bg-gradient-to-br from-indigo-600 to-violet-700 p-6 md:p-10 text-white shadow-2xl shadow-indigo-200/50">
                    <div className="flex flex-col gap-6 h-full justify-between">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                          <Trophy size={14} />
                          Thử thách cao nhất
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">Đề thi thử vào 10</h2>
                        <p className="text-sm text-indigo-100/80 font-medium max-w-md">Cấu trúc {mockQuestionCount} câu hỏi tổng hợp, thời gian làm bài 90 phút.</p>
                      </div>
                      <button 
                        onClick={() => startPractice(undefined, true)}
                        className="w-full rounded-2xl bg-white px-8 py-4 font-black text-indigo-600 shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-50 active:scale-95 text-center"
                      >
                        Bắt đầu thi thử
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[32px] bg-gradient-to-br from-emerald-600 to-teal-700 p-6 md:p-10 text-white shadow-2xl shadow-emerald-200/50">
                    <div className="flex flex-col gap-6 h-full justify-between">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                          <Infinity size={14} />
                          Luyện tập không giới hạn
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">Luyện tập tự do</h2>
                        <p className="text-sm text-emerald-100/80 font-medium max-w-md">Không giới hạn thời gian, không giới hạn câu hỏi. Học tập liên tục.</p>
                      </div>
                      <button 
                        onClick={() => startPractice(undefined, false, true)}
                        className="w-full rounded-2xl bg-white px-8 py-4 font-black text-emerald-600 shadow-xl shadow-emerald-900/20 transition-all hover:bg-emerald-50 active:scale-95 text-center"
                      >
                        Bắt đầu ngay
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between px-2">
                  <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Luyện tập & Thi thử</h2>
                    <p className="text-sm md:text-base text-slate-500 font-medium">Tùy chỉnh cấu trúc bài làm để đạt hiệu quả cao nhất.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Practice Settings */}
                    <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm">
                      <div className="flex items-center gap-2 px-1">
                        <div className="h-6 w-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <PenTool size={12} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số câu luyện tập</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {[5, 10, 15, 20].map((num) => (
                          <button
                            key={num}
                            onClick={() => setQuestionCount(num)}
                            className={`flex-1 h-10 rounded-xl text-xs font-black transition-all ${
                              questionCount === num 
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                                : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 active:scale-90"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mock Exam Settings */}
                    <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm">
                      <div className="flex items-center gap-2 px-1">
                        <div className="h-6 w-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Trophy size={12} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số câu thi thử</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {[20, 30, 40, 50].map((num) => (
                          <button
                            key={num}
                            onClick={() => setMockQuestionCount(num)}
                            className={`flex-1 h-10 rounded-xl text-xs font-black transition-all ${
                              mockQuestionCount === num 
                                ? "bg-amber-500 text-white shadow-lg shadow-amber-200" 
                                : "bg-white text-slate-500 border border-slate-200 hover:border-amber-300 active:scale-90"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <Filter size={18} className="text-slate-400 shrink-0" />
                  {(['ALL', 'NB', 'TH', 'VD'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficultyFilter(level)}
                      className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition-all ${
                        difficultyFilter === level 
                          ? "bg-slate-900 text-white shadow-lg" 
                          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      {level === 'ALL' ? 'Tất cả mức độ' : level === 'NB' ? 'Nhận biết' : level === 'TH' ? 'Thông hiểu' : 'Vận dụng'}
                    </button>
                  ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Trophy size={24} />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">Luyện tập tổng hợp</h3>
                    <p className="mb-6 text-sm text-slate-500">Làm {questionCount} câu hỏi ngẫu nhiên từ tất cả các chương để đánh giá năng lực hiện tại.</p>
                    <button 
                      onClick={() => startPractice()}
                      className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700"
                    >
                      Bắt đầu ngay
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">Luyện theo chương</h3>
                    <p className="mb-6 text-sm text-slate-500">Tập trung vào từng phần kiến thức cụ thể để nắm vững lý thuyết và bài tập.</p>
                    <div className="grid gap-2">
                      {CHAPTERS.map(ch => (
                        <div key={ch.id} className="flex gap-2">
                          <button 
                            onClick={() => startPractice(ch)}
                            className="flex-1 flex items-center justify-between rounded-lg border border-slate-100 p-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <span className="truncate">{ch.title.split(': ')[1]}</span>
                            <ChevronRight size={16} className="text-slate-400" />
                          </button>
                          <button
                            onClick={() => startPractice(ch, false, true)}
                            className="rounded-lg border border-slate-100 p-3 text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Luyện tập không giới hạn"
                          >
                            <Infinity size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mx-auto max-w-3xl"
              >
                {!showResult ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-3 md:gap-4">
                        <button 
                          onClick={() => {
                            if (isMockExam && !showResult) {
                              if (confirm('Bạn có chắc chắn muốn thoát? Kết quả bài thi sẽ không được lưu.')) {
                                setCurrentView('practice');
                              }
                            } else {
                              setCurrentView('practice');
                            }
                          }}
                          className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-100 active:scale-90 transition-all"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <div className="flex flex-col">
                          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                            {isUnlimitedMode ? `Câu ${currentQuestionIndex + 1}` : `Câu ${currentQuestionIndex + 1} / ${quizQuestions.length}`}
                          </span>
                          {isMockExam && (
                            <div className={`flex items-center gap-1.5 text-sm font-black ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-indigo-600'}`}>
                              <Clock size={14} />
                              {formatTime(timeLeft)}
                            </div>
                          )}
                        </div>
                      </div>
                      {!isUnlimitedMode && (
                        <div className="h-2.5 w-24 md:w-40 overflow-hidden rounded-full bg-slate-100 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-100"
                          />
                        </div>
                      )}
                    </div>

                    <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-10 shadow-2xl shadow-slate-200/40">
                      <div className="mb-6 flex items-center justify-between">
                        <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                          quizQuestions[currentQuestionIndex].level === 'NB' ? 'bg-blue-50 text-blue-600' : quizQuestions[currentQuestionIndex].level === 'TH' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {quizQuestions[currentQuestionIndex].level === 'NB' ? 'Nhận biết' : quizQuestions[currentQuestionIndex].level === 'TH' ? 'Thông hiểu' : 'Vận dụng'}
                        </span>
                        <button 
                          onClick={() => askAIAboutQuestion(quizQuestions[currentQuestionIndex])}
                          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                        >
                          <BrainCircuit size={14} />
                          Hỏi AI gợi ý
                        </button>
                      </div>
                      
                      <h3 className="mb-8 text-lg md:text-2xl font-bold leading-relaxed text-slate-800 tracking-tight">
                        {quizQuestions[currentQuestionIndex].text}
                      </h3>

                      <div className="grid gap-3 md:gap-4">
                        {quizQuestions[currentQuestionIndex].options.map((option, i) => {
                          const isCorrect = i === quizQuestions[currentQuestionIndex].correctAnswer;
                          const isSelected = userAnswers[currentQuestionIndex] === i;
                          
                          let buttonClass = "border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-white";
                          let iconClass = "border-slate-200 text-slate-400 bg-white";
                          
                          if (isAnswered) {
                            if (isCorrect) {
                              buttonClass = "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10";
                              iconClass = "border-emerald-500 bg-emerald-500 text-white";
                            } else if (isSelected) {
                              buttonClass = "border-rose-500 bg-rose-50 ring-4 ring-rose-500/10";
                              iconClass = "border-rose-500 bg-rose-500 text-white";
                            } else {
                              buttonClass = "border-slate-100 opacity-40 grayscale";
                            }
                          } else if (isSelected) {
                            buttonClass = "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-600/10";
                            iconClass = "border-indigo-600 bg-indigo-600 text-white";
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => handleAnswer(i)}
                              disabled={isAnswered}
                              className={`group flex items-center justify-between rounded-2xl border-2 p-4 md:p-6 text-left transition-all active:scale-[0.98] ${buttonClass}`}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-black transition-all shadow-sm ${iconClass}`}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className={`text-sm md:text-lg font-bold leading-snug ${
                                  isSelected ? (isAnswered ? (isCorrect ? "text-emerald-900" : "text-rose-900") : "text-indigo-900") : "text-slate-700"
                                }`}>
                                  {option}
                                </span>
                              </div>
                              <div className="shrink-0">
                                {isAnswered && isCorrect && <CheckCircle2 size={24} className="text-emerald-600" />}
                                {isAnswered && isSelected && !isCorrect && <XCircle size={24} className="text-rose-600" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 space-y-6"
                        >
                          {userAnswers[currentQuestionIndex] !== quizQuestions[currentQuestionIndex].correctAnswer && quizQuestions[currentQuestionIndex].explanation && (
                            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
                              <h4 className="mb-2 font-bold text-slate-800 flex items-center gap-2">
                                <BookOpen size={18} className="text-indigo-600" />
                                Giải thích:
                              </h4>
                              <p className="text-sm text-slate-600 leading-relaxed italic">
                                {quizQuestions[currentQuestionIndex].explanation}
                              </p>
                            </div>
                          )}
                          
                          <button
                            onClick={handleNextQuestion}
                            className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 flex items-center justify-center gap-2"
                          >
                            {isUnlimitedMode ? 'Câu tiếp theo' : (currentQuestionIndex < quizQuestions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả')}
                            <ChevronRight size={20} />
                          </button>

                          {isUnlimitedMode && (
                            <button
                              onClick={() => {
                                if (confirm('Bạn muốn kết thúc luyện tập và xem kết quả?')) {
                                  finishQuiz();
                                }
                              }}
                              className="w-full rounded-2xl border-2 border-slate-200 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50"
                            >
                              Kết thúc luyện tập
                            </button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <div className="inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 shadow-lg shadow-amber-100/50 mb-2">
                        <Trophy size={32} className="md:size-10" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        {score === quizQuestions.length ? 'Hoàn hảo!' : score >= quizQuestions.length * 0.8 ? 'Xuất sắc!' : score >= quizQuestions.length / 2 ? 'Làm tốt lắm!' : 'Cố gắng lên nhé!'}
                      </h2>
                      <p className="text-base md:text-lg text-slate-500 font-medium px-4">
                        {isMockExam 
                          ? `Bạn đã hoàn thành bài thi thử với số điểm ${(score * 10 / quizQuestions.length).toFixed(1)}/10`
                          : 'Bạn đã hoàn thành bài luyện tập hôm nay.'}
                      </p>
                    </motion.div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <ResultStatCard 
                        icon={<CheckCircle2 className="text-emerald-500" size={20} />}
                        label="Câu đúng"
                        value={`${score}/${quizQuestions.length}`}
                        subValue="Chính xác"
                        delay={0.1}
                      />
                      <ResultStatCard 
                        icon={<XCircle className="text-rose-500" size={20} />}
                        label="Câu sai"
                        value={(quizQuestions.length - score).toString()}
                        subValue="Cần xem lại"
                        delay={0.2}
                      />
                      <ResultStatCard 
                        icon={<Zap className="text-amber-500" size={20} />}
                        label="Độ chính xác"
                        value={`${Math.round((score / quizQuestions.length) * 100)}%`}
                        subValue="Hiệu suất"
                        delay={0.3}
                      />
                      <ResultStatCard 
                        icon={<BarChart3 className="text-indigo-500" size={20} />}
                        label="Xếp hạng"
                        value={score === quizQuestions.length ? 'S' : score >= quizQuestions.length * 0.8 ? 'A' : score >= quizQuestions.length / 2 ? 'B' : 'C'}
                        subValue="Đánh giá"
                        delay={0.4}
                      />
                    </div>

                    {/* Knowledge Analysis Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="grid gap-6 lg:grid-cols-3"
                    >
                      <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                              <TrendingUp size={24} className="text-indigo-600" />
                              Phân tích kiến thức
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
                                <button 
                                  onClick={() => setChartMetric('percentage')}
                                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                    chartMetric === 'percentage' 
                                      ? "bg-white text-indigo-600 shadow-sm" 
                                      : "text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  Tỷ lệ (%)
                                </button>
                                <button 
                                  onClick={() => setChartMetric('count')}
                                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                    chartMetric === 'count' 
                                      ? "bg-white text-indigo-600 shadow-sm" 
                                      : "text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  Số câu
                                </button>
                              </div>
                              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
                                <button 
                                  onClick={() => setChartLayout('vertical')}
                                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                    chartLayout === 'vertical' 
                                      ? "bg-white text-indigo-600 shadow-sm" 
                                      : "text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  Ngang
                                </button>
                                <button 
                                  onClick={() => setChartLayout('horizontal')}
                                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                    chartLayout === 'horizontal' 
                                      ? "bg-white text-indigo-600 shadow-sm" 
                                      : "text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  Dọc
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <div className="flex items-center gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-emerald-500" />
                              <span className="text-slate-500">Đạt</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-amber-500" />
                              <span className="text-slate-500">Cần cố gắng</span>
                            </div>
                          </div>
                        </div>

                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={knowledgeStats} 
                              layout={chartLayout} 
                              margin={chartLayout === 'vertical' ? { left: 20, right: 40 } : { top: 20, right: 20, left: 20, bottom: 40 }}
                            >
                              <CartesianGrid 
                                strokeDasharray="3 3" 
                                horizontal={chartLayout === 'horizontal'} 
                                vertical={chartLayout === 'vertical'} 
                                stroke="#f1f5f9" 
                              />
                              {chartLayout === 'vertical' ? (
                                <>
                                  <XAxis 
                                    type="number" 
                                    domain={chartMetric === 'percentage' ? [0, 100] : [0, 'dataMax + 1']} 
                                    hide={chartMetric === 'percentage'}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                  />
                                  <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={120} 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                                  />
                                </>
                              ) : (
                                <>
                                  <XAxis 
                                    dataKey="name" 
                                    type="category" 
                                    height={60}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b', angle: -45, textAnchor: 'end' }}
                                  />
                                  <YAxis 
                                    type="number" 
                                    domain={chartMetric === 'percentage' ? [0, 100] : [0, 'dataMax + 1']} 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                  />
                                </>
                              )}
                              <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="rounded-xl bg-slate-900 p-3 shadow-xl text-white text-xs border border-slate-800">
                                        <div className="font-bold mb-1">{data.name}</div>
                                        <div className="flex justify-between gap-4">
                                          <span>Chính xác:</span>
                                          <span className="font-bold text-indigo-400">{data.percentage}%</span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                          <span>Số câu đúng:</span>
                                          <span className="font-bold text-emerald-400">{data.correct}/{data.total}</span>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar 
                                dataKey={chartMetric === 'percentage' ? "percentage" : "correct"} 
                                radius={chartLayout === 'vertical' ? [0, 4, 4, 0] : [4, 4, 0, 0]} 
                                barSize={chartLayout === 'vertical' ? 24 : 32}
                              >
                                {knowledgeStats.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.status === 'Đạt' ? '#10b981' : '#f59e0b'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-full">
                          <h4 className="mb-6 font-bold text-slate-800 flex items-center gap-2">
                            <BrainCircuit size={20} className="text-indigo-600" />
                            Đánh giá chi tiết
                          </h4>
                          
                          <div className="space-y-6">
                            <div>
                              <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <CheckCircle2 size={14} />
                                Đã đạt ({knowledgeStats.filter(s => s.status === 'Đạt').length})
                              </div>
                              <div className="space-y-2">
                                {knowledgeStats.filter(s => s.status === 'Đạt').length > 0 ? (
                                  knowledgeStats.filter(s => s.status === 'Đạt').map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                                      <span className="text-xs font-bold text-emerald-800 line-clamp-1">{s.name}</span>
                                      <span className="text-[10px] font-black text-emerald-600">{s.percentage}%</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-xs text-slate-400 italic p-3">Chưa có phần nào đạt</div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <AlertCircle size={14} />
                                Cần cố gắng ({knowledgeStats.filter(s => s.status === 'Cần cố gắng').length})
                              </div>
                              <div className="space-y-2">
                                {knowledgeStats.filter(s => s.status === 'Cần cố gắng').length > 0 ? (
                                  knowledgeStats.filter(s => s.status === 'Cần cố gắng').map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-100">
                                      <span className="text-xs font-bold text-amber-800 line-clamp-1">{s.name}</span>
                                      <span className="text-[10px] font-black text-amber-600">{s.percentage}%</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-xs text-slate-400 italic p-3">Tuyệt vời! Bạn không có phần nào yếu.</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                      <button 
                        onClick={() => startPractice(selectedChapter || undefined, isMockExam)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
                      >
                        <RotateCcw size={20} />
                        Làm lại bài này
                      </button>
                      <button 
                        onClick={() => setCurrentView('dashboard')}
                        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                      >
                        <Home size={20} />
                        Về trang chủ
                      </button>
                    </div>

                    <div className="space-y-8 pt-10">
                      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Chi tiết bài làm</h3>
                          <div className="flex bg-slate-100 p-1 rounded-xl">
                            {(['ALL', 'CORRECT', 'INCORRECT'] as const).map((filter) => (
                              <button
                                key={filter}
                                onClick={() => setQuizFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                  quizFilter === filter 
                                    ? "bg-white text-indigo-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                {filter === 'ALL' ? 'Tất cả' : filter === 'CORRECT' ? 'Câu đúng' : 'Câu sai'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Question Status Grid */}
                        <div className="flex flex-wrap gap-2">
                          {quizQuestions.map((q, idx) => {
                            const isCorrect = userAnswers[idx] === q.correctAnswer;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setQuizFilter('ALL');
                                  const element = document.getElementById(`question-detail-${idx}`);
                                  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black transition-all hover:scale-110 active:scale-95 ${
                                  isCorrect 
                                    ? "bg-emerald-100 text-emerald-600 border-2 border-emerald-200" 
                                    : "bg-rose-100 text-rose-600 border-2 border-rose-200"
                                }`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="grid gap-6">
                        {filteredQuestions.map((q, filteredIdx) => {
                          const originalIdx = quizQuestions.findIndex(origQ => origQ.id === q.id);
                          const isCorrect = userAnswers[originalIdx] === q.correctAnswer;
                          
                          return (
                            <motion.div 
                              key={q.id}
                              id={`question-detail-${originalIdx}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: filteredIdx * 0.05 }}
                              className={`group rounded-3xl border-2 p-8 transition-all ${
                                isCorrect 
                                  ? "border-emerald-100 bg-white hover:border-emerald-200" 
                                  : "border-rose-100 bg-white hover:border-rose-200 shadow-lg shadow-rose-50"
                              }`}
                            >
                              <div className="mb-6 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                                    isCorrect 
                                      ? "bg-emerald-500 text-white" 
                                      : "bg-rose-500 text-white"
                                  }`}>
                                    {originalIdx + 1}
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {CHAPTERS.find(c => c.id === q.chapterId)?.title.split(': ')[1]}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                        q.level === 'NB' ? 'bg-blue-50 text-blue-600' : q.level === 'TH' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                      }`}>
                                        {q.level === 'NB' ? 'Nhận biết' : q.level === 'TH' ? 'Thông hiểu' : 'Vận dụng'}
                                      </span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-800 leading-tight">{q.text}</p>
                                  </div>
                                </div>
                                {isCorrect ? (
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                    <CheckCircle2 size={24} />
                                  </div>
                                ) : (
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                                    <XCircle size={24} />
                                  </div>
                                )}
                              </div>

                              <div className="ml-14 space-y-6">
                                <div className="grid gap-3">
                                  {q.options.map((option, optIdx) => {
                                    const isSelected = userAnswers[originalIdx] === optIdx;
                                    const isCorrectOpt = q.correctAnswer === optIdx;
                                    
                                    let optionClass = "border-slate-100 bg-slate-50 text-slate-600";
                                    if (isSelected && isCorrectOpt) optionClass = "border-emerald-200 bg-emerald-50 text-emerald-700 font-bold";
                                    else if (isSelected && !isCorrectOpt) optionClass = "border-rose-200 bg-rose-50 text-rose-700 font-bold";
                                    else if (isCorrectOpt) optionClass = "border-emerald-200 bg-emerald-50 text-emerald-700 font-bold";

                                    return (
                                      <div 
                                        key={optIdx}
                                        className={`flex items-center justify-between rounded-2xl border-2 p-4 text-sm transition-all ${optionClass}`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black ${
                                            isCorrectOpt ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 text-slate-400"
                                          }`}>
                                            {String.fromCharCode(65 + optIdx)}
                                          </span>
                                          {option}
                                        </div>
                                        {isSelected && (
                                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Lựa chọn của bạn</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {q.explanation && (
                                  <div className="rounded-3xl bg-indigo-50/50 p-6 text-sm text-slate-700 leading-relaxed border border-indigo-100/50">
                                    <div className="flex items-center gap-2 mb-3 font-black text-indigo-600 text-xs uppercase tracking-widest">
                                      <Lightbulb size={16} />
                                      Giải thích chi tiết
                                    </div>
                                    <div className="prose prose-sm prose-indigo max-w-none">
                                      {q.explanation}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-4">
                                  <button 
                                    onClick={() => askAIAboutQuestion(q)}
                                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-600 border border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
                                  >
                                    <MessageCircle size={14} />
                                    Hỏi AI giải thích thêm
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            {currentView === 'ai-chat' && (
              <motion.div
                key="ai-chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-140px)]"
              >
                <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 mb-4 scroll-smooth">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                        <BrainCircuit size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Gia sư AI Toán 9</h3>
                      <p className="text-sm text-slate-500 max-w-xs">Hỏi bất cứ điều gì về chương trình Toán lớp 9, mình sẽ hướng dẫn bạn từng bước.</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex w-full ${
                        msg.role === 'user' ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-4 shadow-sm ${
                        msg.role === 'user' 
                          ? "bg-indigo-600 text-white rounded-tr-none" 
                          : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                      }`}>
                        <div className={`markdown-body prose max-w-none text-sm md:text-base ${
                          msg.role === 'user' ? "prose-invert" : "prose-indigo"
                        }`}>
                          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {msg.text}
                          </Markdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isChatting && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 rounded-2xl p-4 rounded-tl-none shadow-sm flex items-center gap-3 border border-slate-200">
                        <Loader2 size={18} className="animate-spin text-indigo-600" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gia sư đang soạn câu trả lời...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="relative group">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 pl-6 pr-16 text-sm md:text-base shadow-xl focus:border-indigo-500 focus:outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || isChatting}
                    className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-700 disabled:opacity-50 active:scale-90"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </motion.div>
            )}
            {currentView === 'learning-path' && (
              <motion.div
                key="learning-path"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Phân tích lộ trình học tập</h2>
                      <p className="text-sm text-slate-500">AI phân tích dựa trên {results.length} bài làm gần nhất</p>
                    </div>
                  </div>

                  {isGeneratingPath ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Loader2 size={48} className="mb-4 animate-spin text-indigo-600" />
                      <h3 className="text-lg font-bold text-slate-800">Đang phân tích dữ liệu...</h3>
                      <p className="text-slate-500">Gia sư AI đang xây dựng lộ trình tối ưu cho bạn</p>
                    </div>
                  ) : recommendation ? (
                    <div className="markdown-body prose prose-indigo max-w-none">
                      <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {recommendation}
                      </Markdown>
                      <div className="mt-10 flex flex-wrap gap-4">
                        <button 
                          onClick={() => setCurrentView('practice')}
                          className="rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-95"
                        >
                          Bắt đầu luyện tập ngay
                        </button>
                        <button 
                          onClick={() => setCurrentView('dashboard')}
                          className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
                        >
                          Quay lại Dashboard
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <AlertCircle size={48} className="mb-4 text-slate-300" />
                      <h3 className="text-lg font-bold text-slate-800">Chưa có đủ dữ liệu</h3>
                      <p className="mb-8 text-slate-500">Bạn cần hoàn thành ít nhất một bài luyện tập để AI có thể phân tích.</p>
                      <button 
                        onClick={() => setCurrentView('practice')}
                        className="rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-indigo-700"
                      >
                        Đi tới kho câu hỏi
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {currentView === 'advanced-essay' && (
              <motion.div
                key="advanced-essay"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-1 space-y-3 order-2 lg:order-1">
                    <h3 className="mb-4 text-lg font-black text-slate-800 px-2 uppercase tracking-widest text-[10px]">Danh sách bài toán</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                      {ESSAY_PROBLEMS.map((problem) => (
                        <button
                          key={problem.id}
                          onClick={() => {
                            setSelectedEssay(problem);
                            setShowSolution(false);
                            setShowHint(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full rounded-2xl p-4 text-left transition-all border-2 ${
                            selectedEssay?.id === problem.id 
                              ? "bg-indigo-600 text-white shadow-xl border-indigo-600 scale-[1.02]" 
                              : "bg-white border-slate-100 hover:border-indigo-200 active:scale-95"
                          }`}
                        >
                          <div className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">{problem.level}</div>
                          <div className="font-bold line-clamp-2 text-sm md:text-base">{problem.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 order-1 lg:order-2">
                    {selectedEssay ? (
                      <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-10 shadow-2xl shadow-slate-200/40">
                        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedEssay.title}</h3>
                          <span className="inline-flex w-fit rounded-full bg-amber-50 px-4 py-1.5 text-[10px] font-black text-amber-600 uppercase tracking-widest border border-amber-100">
                            {selectedEssay.level}
                          </span>
                        </div>

                        <div className="mb-8 rounded-3xl bg-slate-50/50 p-6 md:p-8 border border-slate-100 shadow-inner">
                          <div className="markdown-body prose prose-indigo max-w-none text-slate-700 font-medium leading-relaxed text-sm md:text-lg">
                            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {selectedEssay.text}
                            </Markdown>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
                          {selectedEssay.hint && (
                            <button
                              onClick={() => setShowHint(!showHint)}
                              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 font-black text-xs uppercase tracking-widest transition-all ${
                                showHint ? "bg-amber-500 text-white shadow-xl" : "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100"
                              }`}
                            >
                              <Lightbulb size={18} />
                              {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
                            </button>
                          )}
                          <button
                            onClick={() => setShowSolution(!showSolution)}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 font-black text-xs uppercase tracking-widest transition-all ${
                              showSolution ? "bg-emerald-600 text-white shadow-xl" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100"
                            }`}
                          >
                            <Eye size={18} />
                            {showSolution ? 'Ẩn lời giải' : 'Xem lời giải'}
                          </button>
                        </div>

                        <AnimatePresence>
                          {showHint && selectedEssay.hint && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mb-6 overflow-hidden"
                            >
                              <div className="rounded-2xl bg-amber-50 p-6 border border-amber-100">
                                <h4 className="mb-2 font-bold text-amber-800 flex items-center gap-2">
                                  <Lightbulb size={18} />
                                  Gợi ý:
                                </h4>
                                <p className="text-sm text-amber-700 leading-relaxed">
                                  {selectedEssay.hint}
                                </p>
                              </div>
                            </motion.div>
                          )}

                          {showSolution && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
                                <h4 className="mb-4 font-bold text-emerald-800 flex items-center gap-2 border-b border-emerald-100 pb-2">
                                  <CheckCircle2 size={18} />
                                  Lời giải chi tiết:
                                </h4>
                                <div className="markdown-body prose prose-emerald max-w-none text-emerald-900 whitespace-pre-wrap">
                                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {selectedEssay.solution}
                                  </Markdown>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="mt-10 pt-6 border-t border-slate-100">
                          <button 
                            onClick={() => {
                              const prompt = `Hãy hướng dẫn tôi giải bài toán nâng cao sau đây từng bước một:\n\nĐề bài: ${selectedEssay.text}\n\nLời giải tham khảo: ${selectedEssay.solution}`;
                              setChatMessages(prev => [...prev, { role: 'user', text: prompt }]);
                              setCurrentView('ai-chat');
                              handleSendMessageFromPrompt(prompt);
                            }}
                            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline"
                          >
                            <MessageCircle size={18} />
                            Bạn vẫn chưa hiểu? Hãy hỏi Gia sư AI để được giải thích kỹ hơn!
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-96 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 bg-white">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p className="font-medium">Chọn một bài toán để bắt đầu thử thách</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
                  {/* Profile Info Card */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-2xl shadow-slate-200/40 text-center">
                      <div className="relative mx-auto mb-6 h-24 w-24 md:h-32 md:w-32">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-inner">
                          <UserCircle size={64} className="md:size-20" strokeWidth={1} />
                        </div>
                        <button className="absolute bottom-0 right-0 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 shadow-md hover:text-indigo-600 transition-colors">
                          <PenTool size={16} className="md:size-[18px]" />
                        </button>
                      </div>
                      
                      {isEditingProfile ? (
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và tên</label>
                            <input 
                              type="text" 
                              value={editProfileForm.name}
                              onChange={(e) => setEditProfileForm({...editProfileForm, name: e.target.value})}
                              className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trường</label>
                            <input 
                              type="text" 
                              value={editProfileForm.school}
                              onChange={(e) => setEditProfileForm({...editProfileForm, school: e.target.value})}
                              className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lớp</label>
                              <input 
                                type="text" 
                                value={editProfileForm.class}
                                onChange={(e) => setEditProfileForm({...editProfileForm, class: e.target.value})}
                                className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Điểm mục tiêu</label>
                              <input 
                                type="number" 
                                step="0.1"
                                value={editProfileForm.targetScore}
                                onChange={(e) => setEditProfileForm({...editProfileForm, targetScore: parseFloat(e.target.value)})}
                                className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={() => handleUpdateProfile()}
                              className="flex-1 rounded-xl bg-indigo-600 py-3 text-xs font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-200"
                            >
                              Lưu
                            </button>
                            <button 
                              onClick={() => setIsEditingProfile(false)}
                              className="flex-1 rounded-xl border-2 border-slate-100 py-3 text-xs font-black text-slate-500 uppercase tracking-widest"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{userProfile.name}</h3>
                          <p className="text-xs md:text-sm font-bold text-slate-500 mb-6">{userProfile.class} • {userProfile.school}</p>
                          
                          <div className="space-y-4 text-left mb-6 border-t border-slate-100 pt-6">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                              <span className="text-xs md:text-sm font-bold text-slate-600">{userProfile.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mục tiêu</span>
                              <span className="text-xs md:text-sm font-black text-indigo-600">{userProfile.targetScore}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xếp hạng</span>
                              <span className="text-xs md:text-sm font-black text-amber-500">Bạc II</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={() => setIsEditingProfile(true)}
                              className="w-full rounded-2xl border-2 border-slate-100 py-3 text-xs font-black text-slate-600 uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all active:scale-95"
                            >
                              Chỉnh sửa hồ sơ
                            </button>
                            <button 
                              onClick={handleLogout}
                              className="w-full rounded-2xl border-2 border-rose-100 py-3 text-xs font-black text-rose-600 uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                              <LogOut size={16} />
                              Đăng xuất
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                      <h4 className="mb-6 text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Target size={18} className="text-rose-500" />
                        Nguyện vọng vào 10
                      </h4>
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100 shadow-sm shadow-rose-50">
                          <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Nguyện vọng 1</div>
                          <div className="text-sm font-black text-slate-900">{userProfile.targetSchool}</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 opacity-60">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nguyện vọng 2</div>
                          <div className="text-sm font-black text-slate-900">Chưa thiết lập</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats and History */}
                  <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                            <Award size={20} />
                          </div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Thành tích</h4>
                        </div>
                        <div className="flex flex-wrap gap-3 md:gap-4">
                          <div className="group relative">
                            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 border-2 border-amber-200 shadow-sm transition-transform hover:scale-110">
                              <Trophy size={20} className="md:size-6" />
                            </div>
                            <div className="absolute bottom-full left-1/2 mb-2 w-32 -translate-x-1/2 rounded-lg bg-slate-800 p-2 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                              Hoàn thành 10 bài luyện tập
                            </div>
                          </div>
                          <div className="group relative">
                            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 border-2 border-blue-200 shadow-sm transition-transform hover:scale-110">
                              <CheckCircle2 size={20} className="md:size-6" />
                            </div>
                            <div className="absolute bottom-full left-1/2 mb-2 w-32 -translate-x-1/2 rounded-lg bg-slate-800 p-2 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                              Đạt điểm tối đa lần đầu
                            </div>
                          </div>
                          <div className="group relative opacity-30 grayscale">
                            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border-2 border-slate-200 shadow-sm">
                              <Clock size={20} className="md:size-6" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                              <Bell size={20} />
                            </div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nhắc nhở</h4>
                          </div>
                          <button 
                            onClick={() => setShowAddReminder(true)}
                            className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all active:scale-90"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        {notificationPermission !== 'granted' && (
                          <div className="mb-4 rounded-2xl bg-amber-50 p-4 border border-amber-100">
                            <p className="text-[10px] md:text-xs font-bold text-amber-700 mb-2">Bạn chưa bật thông báo. Hãy bật để nhận nhắc nhở học tập.</p>
                            <button 
                              onClick={requestNotificationPermission}
                              className="text-[10px] md:text-xs font-black text-amber-700 underline uppercase tracking-widest"
                            >
                              Bật thông báo ngay
                            </button>
                          </div>
                        )}

                        <div className="space-y-3">
                          {reminders.length === 0 ? (
                            <p className="text-center py-4 text-xs md:text-sm text-slate-400 italic font-bold">Chưa có nhắc nhở nào</p>
                          ) : (
                            reminders.map((reminder) => (
                              <div key={reminder.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 border border-slate-100">
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={() => toggleReminder(reminder.id)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                                      reminder.enabled ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-400"
                                    }`}
                                  >
                                    {reminder.enabled ? <Bell size={16} /> : <BellOff size={16} />}
                                  </button>
                                  <div>
                                    <div className="text-xs md:text-sm font-black text-slate-900">{reminder.time}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hàng ngày</div>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => deleteReminder(reminder.id)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                            <History size={20} />
                          </div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tổng quan</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Số bài đã làm</span>
                            <span className="text-sm md:text-lg font-black text-slate-900">{results.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Điểm trung bình</span>
                            <span className="text-sm md:text-lg font-black text-indigo-600">
                              {results.length > 0 
                                ? (results.reduce((acc, r) => acc + (r.score * 10 / r.total), 0) / results.length).toFixed(1) 
                                : 0}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-2xl shadow-slate-200/40">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <History size={20} className="text-indigo-600" />
                          Lịch sử luyện tập
                        </h4>
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Xem tất cả</button>
                      </div>
                      
                      <div className="space-y-4">
                        {results.length > 0 ? (
                          results.slice(0, 5).map((result, i) => (
                            <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl text-white text-xs md:text-sm font-black shadow-sm ${
                                  result.score / result.total >= 0.8 ? "bg-emerald-500 shadow-emerald-100" : result.score / result.total >= 0.5 ? "bg-amber-500 shadow-amber-100" : "bg-rose-500 shadow-rose-100"
                                }`}>
                                  {Math.round(result.score * 10 / result.total)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs md:text-sm font-black text-slate-900 truncate">
                                    {result.chapterId === 'MOCK' ? 'Đề thi thử vào 10' : (CHAPTERS.find(c => c.id === result.chapterId)?.title.split(': ')[1] || 'Luyện tập tổng hợp')}
                                  </div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {new Date(result.date).toLocaleDateString('vi-VN')} • {result.score}/{result.total} câu
                                  </div>
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-300 flex-shrink-0" />
                            </div>
                          ))
                        ) : (
                          <div className="py-12 text-center text-slate-400">
                            <History size={40} className="mx-auto mb-3 opacity-20" />
                            <p className="text-xs md:text-sm font-bold">Bạn chưa có lịch sử luyện tập</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {showAddReminder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddReminder(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
            >
              <h3 className="mb-6 text-xl font-black text-slate-800">Thêm nhắc nhở mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Thời gian</label>
                  <input 
                    type="time" 
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 p-4 text-2xl font-black text-indigo-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowAddReminder(false)}
                    className="flex-1 rounded-2xl border border-slate-200 py-4 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={addReminder}
                    className="flex-1 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all md:w-full md:flex-row md:gap-3 md:px-6 md:py-3 ${
        active 
          ? "text-indigo-600 md:bg-indigo-50" 
          : "text-slate-400 hover:text-slate-600 md:hover:bg-slate-50"
      }`}
    >
      <span className={`transition-transform ${active ? "scale-110" : ""}`}>{icon}</span>
      <span className={`text-[10px] font-bold md:text-sm ${active ? "opacity-100" : "opacity-70"}`}>{label}</span>
      {active && <motion.div layoutId="nav-pill" className="absolute bottom-0 h-1 w-8 rounded-full bg-indigo-600 md:hidden" />}
    </button>
  );
}

function StatCard({ title, value, subtitle, color }: { title: string; value: string; subtitle: string; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`h-2 w-8 rounded-full ${color}`} />
      </div>
      <div className="mb-1 text-3xl font-black text-slate-800">{value}</div>
      <div className="text-xs font-medium text-slate-400">{subtitle}</div>
    </div>
  );
}

function ResultStatCard({ icon, label, value, subValue, delay }: { icon: React.ReactNode, label: string, value: string, subValue: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm border-b-4 border-b-slate-100"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-black text-slate-800">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{subValue}</div>
    </motion.div>
  );
}

function ChapterCard({ chapter, onClick }: { chapter: Chapter; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-lg"
    >
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            Chương {chapter.id.replace('ch', '')}
          </span>
          <ChevronRight size={18} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-800 group-hover:text-indigo-600">{chapter.title.split(': ')[1]}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{chapter.summary}</p>
      </div>
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-indigo-50/50 transition-transform group-hover:scale-150" />
    </button>
  );
}
