import React from 'react';
import { RotateCcw, Award, TrendingUp } from 'lucide-react';
import { PlayerHistory } from '../types';
import { MAX_TOTAL_PROFIT } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EndScreenProps {
  history: PlayerHistory[];
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ history, onRestart }) => {
  const totalProfit = history.reduce((sum, r) => sum + r.profit, 0);
  
  // Performance Tier
  let tier = "";
  let tierColor = "";
  let message = "";

  if (totalProfit >= 1000000) {
    tier = "Perfekter Monopolist";
    tierColor = "text-yellow-500";
    message = "Unglaublich! Sie haben in jeder Runde optimal gespielt.";
  } else if (totalProfit >= 750000) {
    tier = "Industrie-Tycoon";
    tierColor = "text-green-600";
    message = "Hervorragende Arbeit. Sie haben die Konzepte der vollständigen Konkurrenz gemeistert.";
  } else if (totalProfit >= 250000) {
    tier = "Etablierter Hersteller";
    tierColor = "text-blue-600";
    message = "Gute Arbeit. Sie blieben profitabel, aber es gab Raum für Verbesserungen.";
  } else if (totalProfit >= 0) {
    tier = "Überlebendes Startup";
    tierColor = "text-slate-600";
    message = "Sie haben überlebt, aber gerade so. Denken Sie daran: Preis = Grenzkosten!";
  } else {
    tier = "Bankrott";
    tierColor = "text-red-600";
    message = "Sie haben insgesamt Geld verloren. Überprüfen Sie die Kostenkurven und versuchen Sie es erneut!";
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-2">
        <Award className={`w-16 h-16 mx-auto ${tierColor}`} />
        <h1 className="text-4xl font-bold text-slate-800">Simulation beendet</h1>
        <h2 className={`text-2xl font-bold ${tierColor}`}>{tier}</h2>
        <p className="text-slate-600">{message}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center space-y-2">
          <p className="text-slate-500 uppercase text-sm font-bold">Ihr Gesamtgewinn</p>
          <p className={`text-5xl font-bold ${totalProfit >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
            €{totalProfit.toLocaleString()}
          </p>
          <div className="border-t pt-2 mt-4">
             <p className="text-slate-400 text-sm">vs. Max. Möglich</p>
             <p className="text-xl font-bold text-green-600">€{MAX_TOTAL_PROFIT.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4">Gewinn Runde für Runde</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history}>
                <XAxis dataKey="roundNumber" tick={{fontSize: 10}} />
                <YAxis hide />
                <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="profit" name="Ihr Gewinn" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="optimalProfit" name="Max. Möglich" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Wichtige Erkenntnisse
        </h3>
        <ul className="space-y-3 text-slate-700">
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">1.</span>
            <span><strong>Preisnehmer:</strong> In einem Wettbewerbsmarkt mit identischen Produkten können Sie Ihren Preis nicht selbst festlegen. Sie müssen den Marktpreis akzeptieren.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">2.</span>
            <span><strong>Mengenregel:</strong> Produzieren Sie dort, wo <em>Preis = Grenzkosten</em>. Wenn P &gt; GK, produzieren Sie mehr. Wenn P &lt; GK, produzieren Sie weniger.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">3.</span>
            <span><strong>Markteintritt und -austritt:</strong> Hohe Gewinne (Runde 1-2) ziehen neue Firmen an (Runde 3-4), was das Angebot erhöht und die Preise auf die minimalen Durchschnittskosten drückt (Langfristiges Gleichgewicht).</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">4.</span>
            <span><strong>Nullgewinn:</strong> Langfristig erzielen Wettbewerbsfirmen "null ökonomischen Gewinn" (Runde 5-6). Das ist normal – es bedeutet, dass Sie alle Kosten, einschließlich Ihres eigenen Gehalts und Kapitals, decken.</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5" />
          Nochmal spielen
        </button>
      </div>
    </div>
  );
};

export default EndScreen;