import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Zap, 
  Coffee, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  Brain, 
  LayoutDashboard, 
  Calendar, 
  Settings,
  Play,
  Pause,
  Shield,
  Smartphone,
  Music,
  Monitor,
  MousePointer,
  Keyboard,
  Cpu,
  FileText,
  Download,
  ChevronRight,
  Layers,
  Lightbulb,
  Mic,
  Camera,
  Flame,
  Wind,
  Eye,
  Headphones,
  Sun,
  Volume2,
  MessageSquare,
  CheckCircle2,
  Trees,
  Sprout,
  Swords,
  Heart,
  Star,
  CheckSquare,
  RefreshCw,
  Battery
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  Cell,
  ReferenceLine,
  Legend
} from 'recharts';

// --- Mock Data based on Document Specifications ---

const DAILY_TIMELINE_DATA = [
  { time: '09:00', state: 'NEUTRAL', duration: 15 },
  { time: '09:15', state: 'FLOW', duration: 45 },
  { time: '10:00', state: 'DISTRACTED', duration: 10 },
  { time: '10:10', state: 'BREAK', duration: 5 },
  { time: '10:15', state: 'FLOW', duration: 55 },
  { time: '11:10', state: 'BREAK', duration: 15 },
  { time: '11:25', state: 'FLOW', duration: 40 },
  { time: '12:05', state: 'NEUTRAL', duration: 30 },
  { time: '13:00', state: 'FLOW', duration: 60 },
  { time: '14:00', state: 'DISTRACTED', duration: 20 },
];

const WEEKLY_STAMINA_DATA = [
  { day: 'Mon', score: 42, sessions: 3, avgLength: 25 },
  { day: 'Tue', score: 48, sessions: 4, avgLength: 30 },
  { day: 'Wed', score: 45, sessions: 3, avgLength: 28 },
  { day: 'Thu', score: 55, sessions: 5, avgLength: 35 },
  { day: 'Fri', score: 67, sessions: 5, avgLength: 42 }, // +12% improvement example
  { day: 'Sat', score: 60, sessions: 4, avgLength: 38 },
  { day: 'Sun', score: 72, sessions: 6, avgLength: 45 },
];

const BREAKERS_DATA = [
  { name: 'WhatsApp', count: 8, color: '#EF4444' },
  { name: 'Alt+Tab', count: 6, color: '#F59E0B' },
  { name: 'Idle Time', count: 2, color: '#6B7280' },
  { name: 'Email', count: 4, color: '#F59E0B' },
];

const TRIGGERS_DATA = [
  { name: 'VS Code Active', impact: '+35%', type: 'app' },
  { name: 'LoFi Playlist', impact: '+20%', type: 'music' },
  { name: 'Morning (9-11am)', impact: '+15%', type: 'time' },
  { name: 'DND Enabled', impact: '+40%', type: 'setting' },
];

const AI_INSIGHTS = [
  { 
    id: 1, 
    type: 'Time-Based', 
    text: 'You focused best between 9am–11am today. Schedule your deepest work here tomorrow.', 
    icon: Clock 
  },
  { 
    id: 2, 
    type: 'Breaker-Based', 
    text: 'WhatsApp broke your flow 3 times in the last hour. We recommend enabling Auto-Block for Social Apps.', 
    icon: Smartphone 
  },
  { 
    id: 3, 
    type: 'Trigger-Based', 
    text: 'LoFi music increased your average flow duration by 15%. Consider auto-starting this playlist on flow detect.', 
    icon: Music 
  }
];

const TASKS_DATA = [
  { id: 1, title: 'Complete React Component', duration: '45m', xp: 50, completed: true },
  { id: 2, title: 'Debug API Integration', duration: '30m', xp: 35, completed: false },
  { id: 3, title: 'Write Documentation', duration: '20m', xp: 20, completed: false },
  { id: 4, title: 'Code Review', duration: '15m', xp: 15, completed: false },
];

const FOREST_DATA = [
  { id: 1, type: 'pine', stage: 3 }, // Completed session
  { id: 2, type: 'oak', stage: 3 },
  { id: 3, type: 'pine', stage: 2 }, // Interrupted
  { id: 4, type: 'pine', stage: 3 },
  { id: 5, type: 'oak', stage: 3 },
  { id: 6, type: 'sapling', stage: 1 }, // Current
];

// --- Analysis Mock Data ---
const ANALYSIS_MODELS = [
  { id: 'rf', name: 'Global Model (Random Forest)', desc: 'Trained on general population data. Good baseline.' },
  { id: 'xgb', name: 'Personalized (XGBoost)', desc: 'Adapted to your specific typing/mouse patterns. High accuracy.' },
  { id: 'rule', name: 'Rule-Based Fallback', desc: 'Heuristic rules (high typing speed + low switching). Robust.' },
];

// --- Components ---

const StatCard = ({ title, value, subtext, icon: Icon, trend, onClick, active }) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-xl border shadow-lg transition-all cursor-pointer ${active ? 'bg-slate-800 border-cyan-500/50 ring-1 ring-cyan-500/20' : 'bg-slate-800 border-slate-700 hover:border-cyan-500/30'}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-700/50 rounded-lg text-cyan-400">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-slate-400 text-sm font-medium">{title}</div>
    {subtext && <div className="text-slate-500 text-xs mt-2">{subtext}</div>}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    FLOW: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 animate-pulse',
    NEUTRAL: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
    DISTRACTED: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
    BREAK: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
  };

  const icons = {
    FLOW: Zap,
    NEUTRAL: Monitor,
    DISTRACTED: AlertCircle,
    BREAK: Coffee
  };

  const Icon = icons[status] || Activity;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${styles[status] || styles.NEUTRAL}`}>
      <Icon size={16} />
      <span className="font-bold tracking-wider text-sm">{status}</span>
    </div>
  );
};

const TimelineSegment = ({ data }) => {
  const getColor = (state) => {
    switch (state) {
      case 'FLOW': return 'bg-cyan-500';
      case 'BREAK': return 'bg-emerald-500';
      case 'DISTRACTED': return 'bg-rose-500';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div 
      className={`${getColor(data.state)} h-full rounded-sm relative group transition-all hover:brightness-110`}
      style={{ width: `${data.duration}px`, minWidth: '4px' }}
    >
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 w-max">
        <div className="bg-slate-900 text-xs text-slate-200 px-2 py-1 rounded border border-slate-700 shadow-xl">
          <span className="font-bold block">{data.time}</span>
          {data.state} ({data.duration}m)
        </div>
      </div>
    </div>
  );
};

// --- Feature Monitor Component ---
const FeatureCard = ({ icon: Icon, label, value, unit, status }) => (
  <div className="bg-slate-900/50 border border-slate-700/50 p-3 rounded-lg flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-800 rounded text-slate-400">
        <Icon size={14} />
      </div>
      <span className="text-xs font-medium text-slate-300">{label}</span>
    </div>
    <div className="text-right">
      <div className={`font-mono font-bold ${status === 'good' ? 'text-emerald-400' : status === 'bad' ? 'text-rose-400' : 'text-white'}`}>
        {value} <span className="text-[10px] text-slate-500 font-normal">{unit}</span>
      </div>
    </div>
  </div>
);

// --- Amplification Card Component ---
const AmplificationCard = ({ icon: Icon, title, status, children, active, toggle }) => (
  <div className={`rounded-xl border p-6 transition-all ${active ? 'bg-slate-800 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${active ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
          <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        </div>
        <div>
          <h3 className={`font-semibold ${active ? 'text-white' : 'text-slate-300'}`}>{title}</h3>
          <p className="text-xs text-slate-500">{status}</p>
        </div>
      </div>
      <button 
        onClick={toggle}
        className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-cyan-500' : 'bg-slate-700'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </button>
    </div>
    <div className={`transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
      {children}
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveStatus, setLiveStatus] = useState('FLOW');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Analysis State
  const [selectedModel, setSelectedModel] = useState('xgb');
  const [historyView, setHistoryView] = useState('week');
  
  // Amplification State
  const [ampMusic, setAmpMusic] = useState(true);
  const [ampLight, setAmpLight] = useState(false);
  const [ampNLP, setAmpNLP] = useState(true);
  const [ampBreath, setAmpBreath] = useState(false);
  const [ampPosture, setAmpPosture] = useState(true);
  const [ampStreak, setAmpStreak] = useState(true);

  // Stamina State
  const [userLevel, setUserLevel] = useState(5);
  const [userXP, setUserXP] = useState(650);
  const [userHP, setUserHP] = useState(85);
  const [tasks, setTasks] = useState(TASKS_DATA);

  // Simulated Real-time Feature Data
  const [features, setFeatures] = useState({
    wpm: 65,
    errorRate: 2.1,
    clickRate: 12,
    appContext: 'VS Code',
    hrv: 45
  });
  const [probData, setProbData] = useState([]);

  // Simulated Live Data & Features
  useEffect(() => {
    let interval;
    if (isSimulationRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        
        // 1. Update Features (Random walk)
        setFeatures(prev => ({
          wpm: Math.max(0, prev.wpm + (Math.random() - 0.5) * 10),
          errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5)),
          clickRate: Math.max(0, prev.clickRate + (Math.random() - 0.5) * 5),
          appContext: Math.random() > 0.9 ? (Math.random() > 0.5 ? 'Chrome' : 'Slack') : 'VS Code',
          hrv: Math.max(30, Math.min(100, prev.hrv + (Math.random() - 0.5) * 2))
        }));

        // 2. Calculate Probability (Simulated)
        const newProb = Math.min(1, Math.max(0, 0.6 + Math.sin(elapsedTime / 10) * 0.3 + (Math.random() - 0.5) * 0.1));
        
        // 3. Update Chart Data
        setProbData(prev => {
          const newData = [...prev, { time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }), prob: newProb }];
          return newData.slice(-20); // Keep last 20 points
        });

        // 4. Determine State based on Thresholds
        if (newProb > 0.7) setLiveStatus('FLOW');
        else if (newProb < 0.4) setLiveStatus('DISTRACTED');
        else setLiveStatus('NEUTRAL');

      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulationRunning, elapsedTime]);

  const toggleSimulation = () => {
    setIsSimulationRunning(!isSimulationRunning);
    if (!isSimulationRunning) {
       setProbData([]); // Reset chart on start
       setLiveStatus('FLOW');
    }
  };

  const handleTaskComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    // Simple XP logic
    setUserXP(prev => prev + 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-lg">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Flow Facilitator</h1>
                <p className="text-xs text-slate-500">AI-Powered Deep Work Engine</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('stamina')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'stamina' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Trees size={16} /> Stamina
              </button>
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'analysis' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Activity size={16} /> Realtime Analysis
              </button>
              <button 
                onClick={() => setActiveTab('amplification')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'amplification' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Zap size={16} /> Amplification
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <TrendingUp size={16} /> Trends
              </button>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                <div className={`w-2 h-2 rounded-full ${isSimulationRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                {isSimulationRunning ? 'Sensor Active' : 'Sensor Idle'}
               </div>
              <button 
                onClick={toggleSimulation}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${isSimulationRunning ? 'bg-rose-500/10 text-rose-400 border border-rose-500/50' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900'}`}
              >
                {isSimulationRunning ? <><Pause size={16}/> Stop Sense</> : <><Play size={16}/> Start Live Mode</>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab Content Switching */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Section: Status + Entry Points */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Status */}
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-1 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full transition-all duration-1000 ${liveStatus === 'FLOW' ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className="relative z-10 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Current Session State</h2>
                      <p className="text-slate-400 text-sm">Real-time classification by Sensor Agent</p>
                    </div>
                    <StatusBadge status={liveStatus} />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Flow Probability</div>
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-mono font-light text-white">
                          {(probData.length > 0 ? probData[probData.length -1].prob * 100 : 0).toFixed(0)}
                        </span>
                        <span className="text-xl text-slate-500 mb-1">%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${liveStatus === 'FLOW' ? 'bg-cyan-500' : 'bg-slate-500'}`} 
                          style={{ width: `${(probData.length > 0 ? probData[probData.length -1].prob * 100 : 0)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                       <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">System Actions</div>
                       <div className="flex flex-col gap-2 mt-2">
                        <div className={`flex items-center gap-2 text-sm ${liveStatus === 'FLOW' ? 'text-emerald-400' : 'text-slate-600'}`}>
                          <Shield size={14} /> DND Mode {liveStatus === 'FLOW' ? 'Enabled' : 'Ready'}
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${liveStatus === 'FLOW' ? 'text-emerald-400' : 'text-slate-600'}`}>
                          <Music size={14} /> Focus Music {liveStatus === 'FLOW' ? 'Playing' : 'Paused'}
                        </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Entry Points Column */}
              <div className="flex flex-col gap-4">
                
                {/* Stamina Entry (NEW) */}
                <div className="flex-1 bg-gradient-to-br from-emerald-900 to-slate-900 rounded-xl p-5 border border-emerald-500/30 relative overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 transition-all" onClick={() => setActiveTab('stamina')}>
                  <div className="absolute right-0 top-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Trees size={50} /></div>
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-base flex items-center gap-2">
                      <Trees size={16} className="text-emerald-400"/> Habit & Forest
                    </h3>
                    <p className="text-xs text-emerald-200 mt-1 mb-3">Gamified Focus & Routines.</p>
                    <div className="flex items-center text-xs font-semibold text-emerald-300 group-hover:text-white transition-colors">
                      Build Stamina <ChevronRight size={12} className="ml-1"/>
                    </div>
                  </div>
                </div>

                {/* Amplification Entry */}
                <div className="flex-1 bg-gradient-to-br from-amber-900 to-slate-900 rounded-xl p-5 border border-amber-500/30 relative overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-amber-500/10 transition-all" onClick={() => setActiveTab('amplification')}>
                  <div className="absolute right-0 top-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Zap size={50} /></div>
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-base flex items-center gap-2">
                      <Zap size={16} className="text-amber-400"/> Amplification Tools
                    </h3>
                    <p className="text-xs text-amber-200 mt-1 mb-3">Lighting, Music & Bio-feedback.</p>
                    <div className="flex items-center text-xs font-semibold text-amber-300 group-hover:text-white transition-colors">
                      Open Controls <ChevronRight size={12} className="ml-1"/>
                    </div>
                  </div>
                </div>

              </div>
            </div>

             {/* Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Flow Duration" value="2h 15m" subtext="Goal: 4h" icon={Clock} trend={5} />
              <StatCard title="Longest Session" value="48m" subtext="Best: 1h 10m" icon={Zap} trend={12} />
              <StatCard title="Distractions" value="14" subtext="Blocked" icon={Shield} />
              <StatCard title="Smart Breaks" value="3" subtext="Avg: 4.5/5" icon={Coffee} />
            </div>

            {/* Timeline */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Calendar size={18} className="text-cyan-500"/> Today's Flow Timeline
                </h3>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                   <span className="flex items-center gap-1"><div className="w-3 h-3 bg-cyan-500 rounded-sm"></div> Flow</span>
                   <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Break</span>
                   <span className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> Distracted</span>
                </div>
              </div>
              <div className="h-16 w-full bg-slate-950 rounded-lg flex overflow-hidden relative">
                 {DAILY_TIMELINE_DATA.map((segment, i) => ( <TimelineSegment key={i} data={segment} /> ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500 px-1 font-mono">
                <span>09:00</span><span>11:00</span><span>13:00</span><span>15:00</span><span>17:00</span>
              </div>
            </div>
            
            {/* Insights */}
            <div className="bg-gradient-to-r from-indigo-900/20 to-slate-900 rounded-xl border border-indigo-500/20 p-6">
               <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Brain size={18} className="text-indigo-400"/> AI Actionable Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {AI_INSIGHTS.map((insight) => (
                  <div key={insight.id} className="bg-slate-800/50 p-4 rounded-lg border border-indigo-500/10">
                    <div className="flex items-center gap-2 mb-2 text-indigo-300">
                      <insight.icon size={14} /> <span className="text-xs font-bold uppercase">{insight.type}</span>
                    </div>
                    <p className="text-sm text-slate-300">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NEW SECTION: Stamina & Habit Building */}
        {activeTab === 'stamina' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            
            {/* Header: RPG Status */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold text-2xl relative">
                    {userLevel}
                    <div className="absolute -bottom-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Level</div>
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-white">Focus Warrior</h2>
                    <div className="text-xs text-slate-400">Keep focusing to level up!</div>
                 </div>
               </div>

               <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                     <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-yellow-400 flex items-center gap-1"><Star size={12} className="fill-yellow-400"/> XP</span>
                        <span className="text-slate-500">{userXP} / 1000</span>
                     </div>
                     <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${(userXP / 1000) * 100}%` }}></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-rose-400 flex items-center gap-1"><Heart size={12} className="fill-rose-400"/> Health</span>
                        <span className="text-slate-500">{userHP} / 100</span>
                     </div>
                     <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${userHP}%` }}></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. Gamified Task Manager (Habitica-style) */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-semibold text-white flex items-center gap-2">
                     <Swords size={18} className="text-purple-500"/> Daily Quests
                   </h3>
                   <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">+XP Active</span>
                </div>
                <div className="flex-1 space-y-3">
                   {tasks.map(task => (
                      <div 
                        key={task.id} 
                        onClick={() => handleTaskComplete(task.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 group ${task.completed ? 'bg-slate-800/50 border-slate-800 opacity-60' : 'bg-slate-800 border-slate-700 hover:border-purple-500/50'}`}
                      >
                         <div className={`w-5 h-5 rounded flex items-center justify-center border ${task.completed ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-500 group-hover:border-purple-400'}`}>
                            {task.completed && <CheckSquare size={14} />}
                         </div>
                         <div className="flex-1">
                            <div className={`text-sm font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                               <span className="flex items-center gap-1"><Clock size={10}/> {task.duration}</span>
                               <span className="flex items-center gap-1 text-yellow-500/80"><Star size={10}/> +{task.xp} XP</span>
                            </div>
                         </div>
                      </div>
                   ))}
                   <button className="w-full py-2 border border-dashed border-slate-700 text-slate-500 rounded-lg text-xs hover:bg-slate-800 hover:text-slate-300 transition-colors">
                      + Add New Quest
                   </button>
                </div>
              </div>

              {/* 2. Focus Forest (Visual Growth) */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-semibold text-white flex items-center gap-2">
                     <Trees size={18} className="text-emerald-500"/> Digital Forest
                   </h3>
                   <div className="text-xs text-slate-400">Today's Growth</div>
                 </div>
                 
                 {/* The Forest Grid */}
                 <div className="flex-1 bg-slate-950/50 rounded-xl border border-slate-800 p-4 grid grid-cols-3 gap-4 relative overflow-hidden">
                    {FOREST_DATA.map(tree => (
                       <div key={tree.id} className="aspect-square flex items-center justify-center flex-col gap-2 rounded-lg bg-slate-900/30 border border-slate-800/30 hover:bg-slate-900 transition-colors relative">
                          {tree.stage === 3 ? (
                             <Trees size={32} className="text-emerald-400 fill-emerald-400/20" />
                          ) : tree.stage === 2 ? (
                             <Trees size={28} className="text-yellow-600 opacity-80" /> 
                          ) : (
                             <Sprout size={24} className="text-emerald-300 animate-pulse" />
                          )}
                          {tree.stage === 1 && (
                             <div className="absolute bottom-1 left-0 w-full px-2">
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-emerald-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                                </div>
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
                 <div className="mt-4 text-center text-xs text-slate-500">
                    Plant a tree for every 25m of Deep Work. <br/> Leaving early kills the tree!
                 </div>
              </div>

              {/* 3. Adaptive Routine & Smart Break */}
              <div className="flex flex-col gap-6">
                 
                 {/* Adaptive Monitoring */}
                 <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                    <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                       <RefreshCw size={18} className="text-cyan-500"/> Adaptive Routine
                    </h3>
                    <div className="space-y-4 relative">
                       {/* Timeline Line */}
                       <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-slate-800"></div>

                       <div className="relative pl-8">
                          <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-900"></div>
                          <div className="text-xs text-slate-500 mb-1">09:00 - 11:00 (Completed)</div>
                          <div className="text-sm font-medium text-white">Deep Work Block</div>
                          <div className="text-[10px] text-emerald-400 mt-0.5">Performance: High (92% Flow)</div>
                       </div>

                       <div className="relative pl-8 opacity-50">
                          <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-600 ring-4 ring-slate-900"></div>
                          <div className="text-xs text-slate-500 mb-1">11:00 - 11:15 (Skipped)</div>
                          <div className="text-sm font-medium text-slate-300 line-through">Short Break</div>
                       </div>

                       <div className="relative pl-8">
                          <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-cyan-500 animate-pulse ring-4 ring-slate-900"></div>
                          <div className="text-xs text-cyan-400 mb-1 font-bold">CURRENT (Adapted)</div>
                          <div className="text-sm font-medium text-white">Recovery Break</div>
                          <div className="text-[10px] text-cyan-300 mt-0.5">Increased due to skipped break</div>
                       </div>
                    </div>
                 </div>

                 {/* Smart Break Widget */}
                 <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-xl border border-emerald-500/30 p-6 flex-1 flex flex-col justify-center items-center text-center">
                    <Coffee size={32} className="text-emerald-400 mb-3" />
                    <h4 className="text-white font-bold mb-1">Smart Break Recommender</h4>
                    <div className="text-3xl font-bold text-emerald-400 my-2">12 min</div>
                    <p className="text-xs text-emerald-200/70 mb-4">Based on 52m Work Ratio</p>
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg text-xs transition-colors">
                       Start Break Timer
                    </button>
                 </div>

              </div>
            </div>

            {/* End of Day Insight (Banner) */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-xl border border-indigo-500/30 p-6 flex items-start gap-4">
               <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400 hidden sm:block">
                  <Lightbulb size={24} />
               </div>
               <div>
                  <h3 className="text-white font-bold text-lg mb-1">End of Day Insight</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                     Great job today! You maintained focus for <span className="text-white font-bold">2h 15m</span>. 
                     Your stamina score increased by <span className="text-emerald-400 font-bold">+12%</span> thanks to the 
                     morning deep work block. Tomorrow, try starting with the "API Debugging" task to build momentum early.
                  </p>
               </div>
            </div>

          </div>
        )}

        {/* NEW SECTION: Amplification (Existing) */}
        {activeTab === 'amplification' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* ... (Existing Amplification Content) ... */}
            <div className="bg-gradient-to-r from-amber-900/20 to-slate-900 rounded-xl border border-amber-500/20 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="text-amber-400" /> Amplification Control Center
                </h2>
                <p className="text-slate-400 mt-1">
                  Manage active environmental and physiological boosters.
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-amber-400">AUTO-PILOT ACTIVE</div>
                <div className="text-xs text-slate-500">System automatically engages tools on flow detect</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. Music (Brain.fm) */}
              <AmplificationCard 
                title="Neural Audio" 
                status="Brain.fm Integration" 
                icon={Headphones} 
                active={ampMusic} 
                toggle={() => setAmpMusic(!ampMusic)}
              >
                <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300">DEEP FOCUS</span>
                    <span className="text-xs text-cyan-500 animate-pulse">● LIVE</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-slate-500">
                      <Music size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-2/3 relative overflow-hidden">
                           <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-500">Low-Fi 100Hz</span>
                        <span className="text-[10px] text-slate-500">High Intensity</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AmplificationCard>

              {/* 2. Dynamic Lighting */}
              <AmplificationCard 
                title="Dynamic Lighting" 
                status="Philips Hue Bridge" 
                icon={Lightbulb} 
                active={ampLight} 
                toggle={() => setAmpLight(!ampLight)}
              >
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Temperature</span>
                    <span>4500K (Focus)</span>
                  </div>
                  <input type="range" className="w-full h-1 bg-gradient-to-r from-orange-500 via-white to-blue-300 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Sun size={12} /> Auto-adjusts based on circadian rhythm
                  </div>
                </div>
              </AmplificationCard>

              {/* 3. NLP Task-Aware */}
              <AmplificationCard 
                title="Context Shield" 
                status="NLP Task Monitor" 
                icon={MessageSquare} 
                active={ampNLP} 
                toggle={() => setAmpNLP(!ampNLP)}
              >
                 <div className="mt-4 p-3 bg-slate-800/50 rounded border border-slate-700/50 text-xs font-mono">
                   <div className="text-slate-500 mb-1">{'>'} DETECTED CONTEXT:</div>
                   <div className="text-emerald-400 font-bold">CODING (REACT/JS)</div>
                   <div className="text-slate-500 mt-2 mb-1">{'>'} ACTIVE BLOCKS:</div>
                   <div className="flex flex-wrap gap-1">
                     <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded border border-rose-500/30">YouTube</span>
                     <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded border border-rose-500/30">Reddit</span>
                   </div>
                 </div>
              </AmplificationCard>

              {/* 4. Breathing Detector */}
              <AmplificationCard 
                title="Respiration Monitor" 
                status="Microphone Input" 
                icon={Mic} 
                active={ampBreath} 
                toggle={() => setAmpBreath(!ampBreath)}
              >
                <div className="mt-4 flex items-end gap-1 h-12 justify-center">
                   {[40, 60, 30, 80, 50, 70, 40, 60, 30, 50].map((h, i) => (
                     <div 
                        key={i} 
                        className="w-2 bg-emerald-500/50 rounded-t-sm transition-all duration-300" 
                        style={{ height: `${activeTab==='amplification' && ampBreath ? h + Math.random()*20 : 10}%` }}
                     ></div>
                   ))}
                </div>
                <div className="mt-2 text-center text-xs text-emerald-400 font-bold">
                  Status: Calm (14 breaths/min)
                </div>
              </AmplificationCard>

              {/* 5. Posture & Fatigue */}
              <AmplificationCard 
                title="Ergonomics AI" 
                status="Camera Vision" 
                icon={Eye} 
                active={ampPosture} 
                toggle={() => setAmpPosture(!ampPosture)}
              >
                 <div className="mt-4 flex items-center justify-between bg-slate-950 p-3 rounded-lg">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs text-slate-500">Posture</span>
                       <span className="text-sm font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12}/> Optimal</span>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-800"></div>
                    <div className="flex flex-col gap-1 text-right">
                       <span className="text-xs text-slate-500">Eye Fatigue</span>
                       <span className="text-sm font-bold text-slate-200">Low</span>
                    </div>
                 </div>
              </AmplificationCard>

              {/* 6. Gamified Streaks */}
              <AmplificationCard 
                title="Flow Streaks" 
                status="Habit Engine" 
                icon={Flame} 
                active={ampStreak} 
                toggle={() => setAmpStreak(!ampStreak)}
              >
                 <div className="mt-4 text-center">
                    <div className="inline-block p-3 rounded-full bg-orange-500/20 mb-2 ring-4 ring-orange-500/10">
                       <Flame size={24} className="text-orange-500 fill-orange-500 animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold text-white">12 Days</div>
                    <div className="text-xs text-slate-500">Current Deep Work Streak</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3">
                       <div className="h-full bg-orange-500 w-3/4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 text-right">Next Level: 14 Days</div>
                 </div>
              </AmplificationCard>

            </div>
          </div>
        )}

        {/* Real-time Analysis (Existing) */}
        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* ... (Existing Analysis Content) ... */}
            {/* Header & Model Selection */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="text-cyan-500" /> Flow State Analysis Engine
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Real-time inference, feature monitoring, and model configuration.
                </p>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {ANALYSIS_MODELS.map(model => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${selectedModel === model.id ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Row: Feature Monitor & Probability Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left: Live Features */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex justify-between items-center">
                  <span>Live Sensor Feed</span>
                  <span className={`w-2 h-2 rounded-full ${isSimulationRunning ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                </h3>
                
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 mb-1">Keyboard & Mouse Dynamics</div>
                  <FeatureCard 
                    icon={Keyboard} label="Typing Speed (WPM)" 
                    value={features.wpm.toFixed(0)} unit="words/min" 
                    status={features.wpm > 40 ? 'good' : 'neutral'} 
                  />
                  <FeatureCard 
                    icon={AlertCircle} label="Error Rate" 
                    value={features.errorRate.toFixed(1)} unit="%" 
                    status={features.errorRate < 3 ? 'good' : 'bad'} 
                  />
                  <FeatureCard 
                    icon={MousePointer} label="Mouse Activity" 
                    value={features.clickRate.toFixed(0)} unit="actions/min" 
                    status="neutral" 
                  />
                  
                  <div className="text-xs text-slate-500 mb-1 mt-4">System Context</div>
                  <FeatureCard 
                    icon={Monitor} label="Active Application" 
                    value={features.appContext} unit="" 
                    status={features.appContext === 'VS Code' ? 'good' : 'bad'} 
                  />
                  <FeatureCard 
                    icon={Activity} label="Heart Rate Var (HRV)" 
                    value={features.hrv.toFixed(0)} unit="ms" 
                    status="neutral" 
                  />
                </div>
                
                <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                   <div className="text-xs text-slate-400 mb-2 font-mono">Active Model: <span className="text-cyan-400">{ANALYSIS_MODELS.find(m => m.id === selectedModel)?.name}</span></div>
                   <p className="text-xs text-slate-500 leading-relaxed">
                     {ANALYSIS_MODELS.find(m => m.id === selectedModel)?.desc}
                   </p>
                </div>
              </div>

              {/* Right: Probability Graph */}
              <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Flow Probability Inference</h3>
                    <div className="flex gap-4 text-xs">
                       <span className="flex items-center gap-1 text-emerald-400"><div className="w-3 h-0.5 bg-emerald-400"></div> Entry Threshold (0.7)</span>
                       <span className="flex items-center gap-1 text-rose-400"><div className="w-3 h-0.5 bg-rose-400"></div> Exit Threshold (0.4)</span>
                    </div>
                 </div>
                 
                 <div className="flex-1 min-h-[300px] w-full bg-slate-950/50 rounded-lg border border-slate-800 p-4 relative">
                   {!isSimulationRunning && probData.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                        Click "Start Live Mode" to see real-time inference
                      </div>
                   )}
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={probData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickCount={5} />
                        <YAxis domain={[0, 1]} stroke="#475569" fontSize={10} />
                        <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                        <ReferenceLine y={0.7} stroke="#10b981" strokeDasharray="3 3" label={{ value: "ENTER FLOW", fill: "#10b981", fontSize: 10, position: 'insideBottomRight' }} />
                        <ReferenceLine y={0.4} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "EXIT FLOW", fill: "#f43f5e", fontSize: 10, position: 'insideTopRight' }} />
                        <Line type="monotone" dataKey="prob" stroke="#06b6d4" strokeWidth={3} dot={false} isAnimationActive={false} />
                      </LineChart>
                   </ResponsiveContainer>
                 </div>
              </div>
            </div>

            {/* Historical Analysis */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Historical Flow Trends</h3>
                  <p className="text-sm text-slate-400">Frequency and duration analysis over time.</p>
                </div>
                <div className="flex bg-slate-800 rounded-lg p-1">
                  {['day', 'week', 'month'].map(view => (
                    <button 
                      key={view} 
                      onClick={() => setHistoryView(view)}
                      className={`px-3 py-1 rounded text-xs font-medium capitalize ${historyView === view ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                    >
                      {view}
                    </button>
                  ))}
                  <button className="ml-2 px-3 py-1 text-xs font-medium text-slate-400 hover:text-white border-l border-slate-700 pl-3 flex items-center gap-1">
                    <Download size={12} /> Export
                  </button>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_STAMINA_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#475569" fontSize={12} />
                    <YAxis stroke="#475569" fontSize={12} />
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                    <Bar dataKey="avgLength" name="Avg Session (min)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sessions" name="Session Count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* Analytics Tab Content (Existing) */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-8">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Weekly Stamina Trend</h3>
                  <p className="text-slate-400">Tracking your ability to sustain Deep Work over time.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">56.2</div>
                  <div className="text-sm text-cyan-400">Avg Weekly Score</div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={WEEKLY_STAMINA_DATA}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}/>
                    <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                 <h4 className="font-semibold text-white mb-4">Stamina Formula</h4>
                 <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-400 border border-slate-800">
                   S = (Avg_Session_Len × Num_Sessions) - (Distractions × Penalty)
                 </div>
                 <p className="text-sm text-slate-500 mt-4">
                   Your score is improving primarily due to increased average session length (+7m this week).
                 </p>
              </div>
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h4 className="font-semibold text-white mb-4">Next Level Targets</h4>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center"></div>
                    Reach 70 Stamina Score (Curr: 67)
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-cyan-500 bg-cyan-500/20 flex items-center justify-center text-cyan-500 text-[10px]">✓</div>
                    Reduce daily distractions under 10
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center"></div>
                    Maintain 4h Flow Time for 3 days
                  </li>
                </ul>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}