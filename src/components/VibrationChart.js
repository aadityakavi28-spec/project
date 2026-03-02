import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const VibrationChart = ({ data }) => {
  return (
    <div className="card-professional p-6 border-2 border-slate-200">
      <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-3">
        <span className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-xl">📈</span>
        <span>Vibration Trend (Last 30 seconds)</span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e2e8f0"
            vertical={true}
            horizontal={true}
          />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 11, fill: '#64748b' }}
            domain={[0, 30]}
            stroke="#cbd5e1"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#64748b' }}
            domain={[0, 100]}
            stroke="#cbd5e1"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
            formatter={(value) => [value.toFixed(2), 'Vibration']}
            itemStyle={{ color: '#0ea5e9' }}
          />
          <Legend 
            wrapperStyle={{ color: '#64748b', fontWeight: '500', paddingTop: '10px' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="vibration"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            name="Vibration (m/s²)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VibrationChart;
