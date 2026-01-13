interface StatCardProps {
  label: string;
  value: string;
  color: string;
}

export const StatCard = ({ label, value, color }: StatCardProps) => (
  <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
  </div>
);