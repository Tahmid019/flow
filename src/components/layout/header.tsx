'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MainNavItem } from '@/lib/types';
import {
  Brain,
  LayoutDashboard,
  Trees,
  Activity,
  Zap,
  TrendingUp,
  Play,
  Pause,
} from '@/components/icons';

interface HeaderProps {
  activeTab: MainNavItem;
  setActiveTab: (tab: MainNavItem) => void;
  isSimulationRunning: boolean;
  toggleSimulation: () => void;
}

const navItems: { id: MainNavItem; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'stamina', label: 'Stamina', icon: Trees },
  { id: 'analysis', label: 'Realtime Analysis', icon: Activity },
  { id: 'amplification', label: 'Amplification', icon: Zap },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
];

export default function Header({
  activeTab,
  setActiveTab,
  isSimulationRunning,
  toggleSimulation,
}: HeaderProps) {
  return (
    <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">FocusPulse</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Deep Work Engine</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1 bg-secondary p-1 rounded-lg border">
            {navItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'flex items-center gap-2 font-medium transition-all',
                  activeTab === item.id
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon size={16} /> {item.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full border">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  isSimulationRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
                )}
              ></div>
              {isSimulationRunning ? 'Sensor Active' : 'Sensor Idle'}
            </div>
            <Button
              onClick={toggleSimulation}
              variant={isSimulationRunning ? 'destructive' : 'default'}
              className="font-semibold transition-all"
              size="sm"
            >
              {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
              {isSimulationRunning ? 'Stop Sense' : 'Start Live Mode'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
