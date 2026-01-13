import { Server, Wifi, HardDrive, Activity } from 'lucide-react';

export const MissionControl = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const stats = [
    { label: 'Cloud Storage', value: '84.2 TB', sub: 'of 100 TB', icon: HardDrive, color: 'text-blue-400' },
    { label: 'Fusion Nodes', value: '12 Active', sub: '3 Standby', icon: Server, color: 'text-emerald-400' },
    { label: 'API Latency', value: '24ms', sub: 'NASA/MAST Endpoint', icon: Wifi, color: 'text-cyan-400' },
    { label: 'Processing Load', value: '62%', sub: 'GPU Cluster 01', icon: Activity, color: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {stats.map((stat, i) => (
        <div key={i} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'} shadow-xl`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">System Healthy</span>
          </div>
          <h3 className="text-2xl font-bold">{stat.value}</h3>
          <p className="text-sm text-slate-500">{stat.label}</p>
          <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono">
            {stat.sub}
          </div>
        </div>
      ))}
    </div>
  );
};