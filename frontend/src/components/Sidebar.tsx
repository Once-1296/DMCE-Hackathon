import { Table, Map, BarChart3, Database, Layers, Settings as SettingsIcon } from 'lucide-react';

interface SidebarProps {
  activeView: 'discovery' | 'skymap' | 'analytics' | 'repository';
  onViewChange: (view: 'discovery' | 'skymap' | 'analytics' | 'repository') => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'discovery', icon: Table, label: 'Discovery' },
    { id: 'skymap', icon: Map, label: 'Sky Map' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'repository', icon: Database, label: 'Repository' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-[#0B0C10]/80 backdrop-blur-xl border-r border-white/10 z-50 transition-all duration-300">
      <div className="flex flex-col h-full p-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Layers className="text-white" size={22} />
          </div>
          <span className="font-bold text-xl tracking-tight hidden md:block">COSMIC</span>
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
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-cyan-400' : 'group-hover:text-slate-200'} />
                <span className="font-medium hidden md:block">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] hidden md:block" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-white/5 transition-all">
            <SettingsIcon size={22} />
            <span className="font-medium hidden md:block">Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};