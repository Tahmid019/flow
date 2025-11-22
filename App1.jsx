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
  Layers
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveStatus, setLiveStatus] = useState('FLOW');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Analysis State
  const [selectedModel, setSelectedModel] = useState('xgb');
  const [historyView, setHistoryView] = useState('week');
  
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
            
            <div className="hidden md:flex items-center space-x-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'analysis' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Activity size={16} /> Realtime Analysis
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <TrendingUp size={16} /> Trends & Stamina
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
            {/* Hero Status Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              {/* Entry Point to Analysis Page */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 border border-indigo-500/30 flex flex-col justify-between relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('analysis')}>
                <div className="absolute inset-0 bg-grid-slate-700/20 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
                <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Activity size={80} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    <Activity size={20} className="text-indigo-400"/> Flow Detection
                  </h3>
                  <p className="text-sm text-indigo-200 mb-4">
                    View real-time model inference, feature vectors, and probability thresholds.
                  </p>
                </div>
                <div className="relative z-10 mt-4">
                  <button className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-indigo-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all group-hover:border-indigo-400 group-hover:text-white">
                    View Analysis <ChevronRight size={16} />
                  </button>
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

        {/* NEW SECTION: Real-time Analysis */}
        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            
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
            {/* ... existing Bottom grids ... */}
          </div>
        )}

      </main>
    </div>
  );
}