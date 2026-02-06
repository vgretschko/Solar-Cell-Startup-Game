import React, { useState, useMemo } from 'react';
import { DollarSign, Factory, TrendingUp, AlertCircle } from 'lucide-react';
import { RoundScenario, CostData } from '../types';
import { calculateCosts, DEFAULT_FIXED_COST, generateCostCurveData } from '../constants';
import CostChart from './CostChart';

interface GameScreenProps {
  roundData: RoundScenario;
  roundIndex: number;
  cumulativeProfit: number;
  onSubmit: (price: number, quantity: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ roundData, roundIndex, cumulativeProfit, onSubmit }) => {
  const [quantity, setQuantity] = useState<number>(5000);
  const [price, setPrice] = useState<string>('');
  
  // Use the round specific fixed cost or the default
  const currentFixedCost = roundData.fixedCostOverride ?? DEFAULT_FIXED_COST;
  const isFixedCostShock = currentFixedCost > DEFAULT_FIXED_COST;

  // Recalculate cost data based on the potentially new fixed costs
  const currentCosts: CostData = calculateCosts(quantity, currentFixedCost);
  
  // Generate chart data for this specific round (so ATC shifts if FC changes)
  const chartData = useMemo(() => generateCostCurveData(currentFixedCost), [currentFixedCost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice) && numPrice >= 0) {
      onSubmit(numPrice, quantity);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 text-white p-4 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Runde</p>
            <p className="text-2xl font-bold">{roundIndex + 1} / 8</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-400" />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 flex items-center justify-between">
           <div>
            <p className="text-slate-500 text-sm">Marktpreis</p>
            <p className="text-2xl font-bold text-green-600">€{roundData.marketPrice.toFixed(2)}</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-600" />
        </div>

        <div className={`p-4 rounded-lg shadow-md border border-slate-200 flex items-center justify-between ${cumulativeProfit >= 0 ? 'bg-white' : 'bg-red-50'}`}>
          <div>
            <p className="text-slate-500 text-sm">Gesamtgewinn</p>
            <p className={`text-2xl font-bold ${cumulativeProfit >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
              {cumulativeProfit >= 0 ? '€' : '-€'}{Math.abs(cumulativeProfit).toLocaleString()}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-slate-400" />
        </div>
      </div>

      {/* News Ticker */}
      <div className={`border-l-4 p-4 rounded-r shadow-sm ${isFixedCostShock ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
        <h3 className={`font-bold mb-1 ${isFixedCostShock ? 'text-red-800' : 'text-blue-800'}`}>
          {isFixedCostShock ? 'ACHTUNG: KOSTENSCHOCK' : 'Marktnachrichten'}
        </h3>
        <p className={`text-lg ${isFixedCostShock ? 'text-red-900' : 'text-blue-900'}`}>{roundData.newsHeadline}</p>
        {isFixedCostShock && (
           <p className="text-sm text-red-700 mt-2 flex items-center gap-2">
             <AlertCircle className="w-4 h-4"/>
             Ihre Fixkosten sind auf €{currentFixedCost.toLocaleString()} gestiegen!
           </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left: Decisions */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Produktionsentscheidungen</h2>
            
            {/* Price Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Preis festlegen (€ pro Einheit)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full rounded-md border-slate-300 py-3 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-lg border bg-slate-50"
                  placeholder="Geben Sie Ihren Preis ein..."
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Aktueller Marktpreis: €{roundData.marketPrice}</p>
            </div>

            {/* Quantity Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Produktionsmenge
                </label>
                <span className="text-lg font-bold text-blue-600">{quantity.toLocaleString()} Einheiten</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0</span>
                <span>5k</span>
                <span>10k</span>
              </div>
            </div>

            {/* Projected Costs Preview */}
            <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-200">
              <p className="text-sm font-semibold text-slate-600">Prognostizierte Kosten für {quantity.toLocaleString()} Einheiten:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Gesamtkosten:</span>
                  <div className="font-mono font-bold">€{currentCosts.tc.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-slate-500">Grenzkosten (GK):</span>
                  <div className="font-mono font-bold text-slate-700">
                    €{currentCosts.mc.toFixed(2)}
                  </div>
                </div>
              </div>
              {isFixedCostShock && (
                <p className="text-xs text-red-600 italic border-t border-slate-200 pt-2 mt-2">
                  Hinweis: Ihre Gesamtkosten sind aufgrund der höheren Fixkosten gestiegen, aber beachten Sie, dass sich Ihre Grenzkosten (Kosten der nächsten Einheit) nicht verändert haben.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={price === ''}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <Factory className="w-5 h-5" />
              Produktion bestätigen
            </button>
          </form>
        </div>

        {/* Right: Charts/Reference */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Marktanalyse</h3>
            {/* Pass the specific chart data including Fixed Cost changes */}
            <CostChart currentQ={quantity} marketPrice={roundData.marketPrice} data={chartData} />
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
             <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Kostenreferenz (Aktuelle Runde)</h3>
             <div className="overflow-x-auto">
               <table className="min-w-full text-sm text-left text-slate-600">
                 <thead className="bg-slate-50 text-xs uppercase font-semibold">
                   <tr>
                     <th className="px-3 py-2">Menge</th>
                     <th className="px-3 py-2">Gesamtkosten</th>
                     <th className="px-3 py-2">GK</th>
                     <th className="px-3 py-2">DK</th>
                   </tr>
                 </thead>
                 <tbody>
                   {[1000, 3000, 5000, 7000, 9000].map(q => {
                     // Must use currentFixedCost here too!
                     const c = calculateCosts(q, currentFixedCost);
                     const isMin = q === 5000;
                     return (
                       <tr key={q} className={`border-b ${isMin ? 'bg-yellow-50 font-bold' : ''}`}>
                         <td className="px-3 py-1">{q.toLocaleString()}</td>
                         <td className="px-3 py-1">€{c.tc.toLocaleString()}</td>
                         <td className="px-3 py-1">€{c.mc.toFixed(0)}</td>
                         <td className="px-3 py-1">€{c.atc.toFixed(2)}</td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
               {isFixedCostShock && (
                 <p className="text-xs text-red-500 mt-2 text-center">
                   * Gesamtkosten & DK sind höher als üblich (hohe Fixkosten).
                 </p>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;