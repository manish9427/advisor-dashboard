'use client';

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, LineChart, Settings, Plus, 
  Search, Bell, ChevronRight, ChevronLeft, Activity, ShieldAlert 
} from 'lucide-react';
import NetworkGraph from '@/components/NetworkGraph';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface ClientCard {
  initials: string;
  name: string;
  aum: string;
  badge: string | null;
  badgeColor: string;
  note: string;
  meta: string | null;
  cta: string | null;
}

interface DashboardData {
  user: string;
  date: string;
  stats: { clients: number; bookValue: string };
  todaysBrief: { label: string; text: string; actions: string[] };
  clientsNeedingAttention: { count: number; cards: ClientCard[] };
  rmHeartbeat: {
    label: string; badge: string; clients: number; holdings: number;
    flagged: number; totalAum: string; aumChange: string; filters: string[];
  };
}

// --- Components ---

const Sidebar = () => (
  <aside className="hidden md:flex flex-col items-center w-16 bg-[#0f172a] border-r border-slate-800 py-6 gap-8 h-screen sticky top-0 z-50">
    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">AD</div>
    <nav className="flex flex-col gap-6 text-slate-400">
      <button className="p-2 hover:text-white transition-colors"><LayoutDashboard size={20} /></button>
      <button className="p-2 hover:text-white transition-colors"><Users size={20} /></button>
      <button className="p-2 text-white bg-slate-800 rounded-lg"><Briefcase size={20} /></button>
      <button className="p-2 hover:text-white transition-colors"><LineChart size={20} /></button>
      <button className="p-2 hover:text-white transition-colors mt-auto"><Settings size={20} /></button>
    </nav>
  </aside>
);

const MobileNav = () => (
  <div className="md:hidden fixed bottom-0 w-full bg-[#0f172a] border-t border-slate-800 flex justify-around p-3 z-50">
    <button className="text-slate-400 p-2"><LayoutDashboard size={20} /></button>
    <button className="text-slate-400 p-2"><Users size={20} /></button>
    <button className="text-white bg-slate-800 p-2 rounded-lg"><Briefcase size={20} /></button>
    <button className="text-slate-400 p-2"><LineChart size={20} /></button>
    <button className="text-slate-400 p-2"><Settings size={20} /></button>
  </div>
);

const Badge = ({ children, color }: { children: React.ReactNode; color?: string }) => {
  const colorMap: Record<string, string> = {
    red: 'bg-red-100 text-red-700 border-red-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-100 text-amber-700 border-amber-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", colorMap[color || 'default'])}>
      {children}
    </span>
  );
};

// --- Main Page ---
export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch dashboard data", err));
  }, []);

  if (loading || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading dashboard...</div>;
  }

  const { todaysBrief, clientsNeedingAttention, rmHeartbeat } = data;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar />
      <MobileNav />

      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Good evening, {data.user}</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
              {data.date} · {data.stats.clients} Clients · {data.stats.bookValue}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} /> New Review
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-lg"><Bell size={18} /></button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">
          
          {/* Today's Brief */}
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg">
            <p className="text-xs font-bold text-slate-400 tracking-wider mb-2 uppercase">{todaysBrief.label}</p>
            <h2 className="text-lg md:text-xl font-medium mb-4 leading-relaxed">{todaysBrief.text}</h2>
            <div className="flex flex-wrap gap-3">
              {todaysBrief.actions.map((action, i) => (
                <button key={i} className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors backdrop-blur-sm">
                  {action}
                </button>
              ))}
            </div>
          </section>

          {/* Clients Needing Attention */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">Clients Needing Attention</h2>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{clientsNeedingAttention.count}</span>
              </div>
              <div className="hidden md:flex gap-1">
                <button className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400"><ChevronLeft size={16} /></button>
                <button className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400"><ChevronRight size={16} /></button>
              </div>
            </div>
            
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
              {clientsNeedingAttention.cards.map((client, idx) => (
                <div key={idx} className="min-w-[280px] max-w-[320px] flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm snap-start flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {client.initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{client.name}</h3>
                          <p className="text-xs text-slate-500">{client.aum}</p>
                        </div>
                      </div>
                      {client.badge && <Badge color={client.badgeColor}>{client.badge}</Badge>}
                    </div>
                    <p className="text-sm text-slate-600 leading-snug mt-3 mb-4">{client.note}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                    {client.meta && <span className="text-[10px] text-slate-400 font-medium">{client.meta}</span>}
                    {client.cta && (
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors">
                        {client.cta}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RM Heartbeat & Graph */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Heartbeat Bar */}
            <div className="bg-slate-900 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-indigo-400" />
                  <span className="font-bold text-sm">{rmHeartbeat.label}</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    {rmHeartbeat.badge}
                  </span>
                </div>
                <div className="hidden md:block h-4 w-px bg-slate-700"></div>
                <div className="flex gap-4 text-xs font-medium text-slate-300">
                  <span>{rmHeartbeat.clients} Clients</span>
                  <span>{rmHeartbeat.holdings} Holdings</span>
                  <span className="text-red-400 flex items-center gap-1"><ShieldAlert size={12} /> {rmHeartbeat.flagged} Flagged</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold">{rmHeartbeat.totalAum}</p>
                  <p className="text-[10px] text-emerald-400 font-medium">{rmHeartbeat.aumChange}</p>
                </div>
                <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"><Settings size={16} /></button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex overflow-x-auto gap-2 hide-scrollbar">
              {rmHeartbeat.filters.map((filter, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                    i === 0 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Graph */}
            <div className="p-4">
              <NetworkGraph />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}