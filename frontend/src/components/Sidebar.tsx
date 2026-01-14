import { Table, Map, BarChart3, Database, Layers, Upload, Settings as SettingsIcon, Activity, Server } from 'lucide-react';

interface SidebarProps {
  activeView: 'discovery' | 'skymap' | 'analytics' | 'repository' | 'ingestion' | 'ai';
  onViewChange: (view: any) => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'ingestion', icon: Upload, label: 'Ingest Data' },
    { id: 'discovery', icon: Table, label: 'Discovery' },
    { id: 'skymap', icon: Map, label: 'Sky Map' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'repository', icon: Database, label: 'Repository' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-[#0B0C10]/90 backdrop-blur-2xl border-r border-white/10 z-50 transition-all duration-300 flex flex-col justify-between">
      <div className="flex flex-col h-full p-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 relative group">
            <Layers className="text-white relative z-10" size={22} />
            <div className="absolute inset-0 bg-white/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="hidden md:block">
            <span className="font-bold text-xl tracking-tight text-white block">COSMIC</span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block">Data Fusion</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 w-1 h-full bg-cyan-400 shadow-[0_0_10px_cyan]"></div>}
                <Icon size={22} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium hidden md:block">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Server Status */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          
          {/* Cloud Status Indicator */}
          <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-black/40 border border-white/5">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold">System Online</span>
              <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                <Activity size={10} /> 24ms latency
              </span>
            </div>
          </div>

          <button className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-white/5 transition-all">
            <SettingsIcon size={22} />
            <span className="font-medium hidden md:block">Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};