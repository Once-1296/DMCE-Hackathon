import { Rocket, LayoutDashboard, Database, Globe, Activity } from 'lucide-react';

export const Sidebar = () => (
  <div className="fixed left-0 top-0 h-full w-20 md:w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 transition-all duration-300">
    <div className="p-6 flex items-center gap-3 text-cyan-400 mb-6">
      <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
        <Rocket size={24} />
      </div>
      <span className="font-bold text-xl tracking-wider hidden md:block text-white uppercase">Cosmic</span>
    </div>
    <nav className="flex-1 px-4 space-y-2">
      {[
        { icon: LayoutDashboard, label: "Dashboard", active: true },
        { icon: Database, label: "Repository", active: false },
        { icon: Globe, label: "Sky Map", active: false },
        { icon: Activity, label: "Analytics", active: false },
      ].map((item, idx) => (
        <button key={idx} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${item.active ? 'bg-cyan-500/20 text-cyan-300 border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
          <item.icon size={20} />
          <span className="font-medium hidden md:block">{item.label}</span>
        </button>
      ))}
    </nav>
  </div>
);