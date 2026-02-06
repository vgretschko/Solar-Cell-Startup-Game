import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DEFAULT_COST_CURVE_DATA } from '../constants';
import { CostData } from '../types';

interface CostChartProps {
  currentQ?: number;
  marketPrice?: number;
  data?: CostData[]; // Allow passing custom data (e.g. for high fixed cost rounds)
}

const CostChart: React.FC<CostChartProps> = ({ currentQ, marketPrice, data }) => {
  // Use passed data or fallback to default
  const chartData = data || DEFAULT_COST_CURVE_DATA;

  return (
    <div className="w-full h-64 bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="q" 
            type="number" 
            domain={[0, 10000]} 
            label={{ value: 'Menge', position: 'insideBottomRight', offset: -5 }} 
            tick={{fontSize: 12}}
            tickFormatter={(val) => `${val/1000}k`}
          />
          <YAxis 
            domain={[0, 300]} 
            label={{ value: 'Preis / Kosten (€)', angle: -90, position: 'insideLeft' }} 
            tick={{fontSize: 12}}
          />
          <Tooltip 
            formatter={(value: number) => [`€${value.toFixed(2)}`, '']}
            labelFormatter={(label) => `Menge: ${label}`}
          />
          <Legend verticalAlign="top" height={36}/>
          
          <Line 
            type="monotone" 
            dataKey="mc" 
            stroke="#ef4444" 
            name="Grenzkosten (GK)" 
            strokeWidth={2} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="atc" 
            stroke="#3b82f6" 
            name="Ø Gesamtkosten (DK)" 
            strokeWidth={2} 
            dot={false}
          />
          
          {marketPrice !== undefined && (
            <ReferenceLine y={marketPrice} label={`Markt: €${marketPrice}`} stroke="#10b981" strokeDasharray="5 5" />
          )}
          
          {currentQ !== undefined && (
             <ReferenceLine x={currentQ} stroke="#64748b" label={`Q: ${currentQ}`} />
          )}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostChart;