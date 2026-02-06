import React from 'react';
import { Sun, Play } from 'lucide-react';
import CostChart from './CostChart';
import { calculateCosts } from '../constants';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in -mt-8">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-yellow-100 rounded-full shadow-lg">
              <Sun className="w-12 h-12 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white drop-shadow-md">Willkommen bei SunBright Solar</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto font-light">
            Sie haben gerade eine mittelgroße Solarzellenfabrik eröffnet. Sie sind einer von Tausenden Produzenten auf dem Weltmarkt.
            Ihre Zellen sind identisch mit denen aller anderen – die Käufer achten nur auf den Preis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="bg-white/95 p-6 rounded-xl shadow-xl border border-slate-200 backdrop-blur-md">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Ihre Mission</h3>
              <p className="text-slate-600 mb-2">
                Treffen Sie kluge Produktionsentscheidungen, um Ihren Gewinn über <strong>8 Quartale</strong> (2 Jahre) zu maximieren.
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Setzen Sie Ihren <strong>Preis</strong></li>
                <li>Bestimmen Sie Ihre <strong>Menge</strong></li>
                <li>Reagieren Sie auf Marktveränderungen</li>
              </ul>
            </div>

            <div className="bg-white/95 p-6 rounded-xl shadow-xl border border-slate-200 backdrop-blur-md">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Kosten-Referenztabelle</h3>
              <div className="overflow-x-auto">
                 <table className="min-w-full text-sm text-left text-slate-600">
                   <thead className="bg-slate-100 text-xs uppercase font-semibold text-slate-700">
                     <tr>
                       <th className="px-2 py-2">Menge</th>
                       <th className="px-2 py-2">Gesamtkosten</th>
                       <th className="px-2 py-2">GK</th>
                       <th className="px-2 py-2">DK</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {[0, 2000, 4000, 5000, 6000, 8000, 10000].map(q => {
                       const c = calculateCosts(q);
                       return (
                         <tr key={q} className="hover:bg-slate-50 transition-colors">
                           <td className="px-2 py-1 font-medium">{q}</td>
                           <td className="px-2 py-1">€{c.tc.toLocaleString()}</td>
                           <td className="px-2 py-1">€{c.mc.toFixed(0)}</td>
                           <td className="px-2 py-1">{q === 0 ? '—' : `€${c.atc.toFixed(2)}`}</td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
                 <p className="text-xs text-slate-500 mt-2 italic text-center">
                   Fixkosten: €375.000 | Max. Kapazität: 10.000 Einheiten
                 </p>
               </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="bg-white/95 p-6 rounded-xl shadow-xl border border-slate-200 backdrop-blur-md">
              <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Kostenanalyse</h3>
              <CostChart />
              <p className="text-xs text-slate-500 text-center italic mt-2">
                Beachten Sie, wie die DK (Blau) ihr Minimum erreichen, wo sie die GK (Rot) schneiden.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform ring-4 ring-blue-500/30"
          >
            <Play className="w-6 h-6" />
            Produktion starten
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;