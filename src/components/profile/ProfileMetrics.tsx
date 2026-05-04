import React from 'react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { TrendingUp, ChevronRight } from 'lucide-react';

const mockChartData = [
  { day: 'Mon', value: 74.5 }, { day: 'Tue', value: 74.8 }, { day: 'Wed', value: 74.2 },
  { day: 'Thu', value: 74.6 }, { day: 'Fri', value: 75.1 }, { day: 'Sat', value: 75.0 },
  { day: 'Sun', value: 74.9 },
];

export const ProfileMetrics: React.FC = () => {
  const metrics = [
    { label: 'Weight', color: '#8b5cf6' },
    { label: 'Body Fat', color: '#ec4899' },
    { label: 'Muscle Mass', color: '#10b981' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-[#94a3b8]">
          <TrendingUp size={14} className="text-purple-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Tracked Metrics</span>
        </div>
        <ChevronRight size={14} className="text-slate-600" />
      </div>
      <div className="overflow-x-auto no-scrollbar flex gap-4 px-4 pb-2">
        {metrics.map((item, idx) => (
          <div key={idx} className="glass-card min-w-[200px] h-[120px] p-3 border-white/5 bg-white/5 relative flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{item.label}</span>
            <div className="flex-1 w-full translate-x-[-10px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <Area type="monotone" dataKey="value" stroke={item.color} fill={item.color} fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute top-3 right-3 text-[10px] font-black text-white italic">74.9 kg</div>
          </div>
        ))}
      </div>
    </div>
  );
};
