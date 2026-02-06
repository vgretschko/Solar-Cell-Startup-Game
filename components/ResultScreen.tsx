import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle, TrendingDown, Info } from 'lucide-react';
import { PlayerHistory, CostData } from '../types';
import { calculateCosts, DEFAULT_FIXED_COST } from '../constants';

interface ResultScreenProps {
  history: PlayerHistory[];
  onNext: () => void;
  isLastRound: boolean;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ history, onNext, isLastRound }) => {
  const currentResult = history[history.length - 1];
  const { 
    marketPrice, 
    userPrice, 
    quantityProduced, 
    quantitySold, 
    revenue, 
    totalCost, 
    profit,
    fixedCost
  } = currentResult;

  const costData: CostData = calculateCosts(quantityProduced, fixedCost);
  const isHighFixedCost = fixedCost > DEFAULT_FIXED_COST;
  
  // Logic to determine feedback message
  let feedbackTitle = "";
  let feedbackMessage = "";
  let feedbackColor = "";

  if (userPrice > marketPrice) {
    feedbackTitle = "Preis zu hoch!";
    feedbackMessage = `Sie haben Ihren Preis auf €${userPrice.toFixed(2)} gesetzt, aber der Marktpreis lag bei €${marketPrice.toFixed(2)}. In einem Markt mit vollständiger Konkurrenz fanden Käufer identische Solarzellen anderswo günstiger. Sie haben 0 Einheiten verkauft.`;
    feedbackColor = "text-red-600 bg-red-50 border-red-200";
  } else if (userPrice < marketPrice) {
    feedbackTitle = "Geld verschenkt";
    feedbackMessage = `Sie haben alle ${quantitySold} Einheiten sofort verkauft! Allerdings haben Sie €${userPrice.toFixed(2)} verlangt, obwohl Käufer bereit waren, €${marketPrice.toFixed(2)} zu zahlen. Sie hätten für die gleiche Arbeit mehr Umsatz erzielen können.`;
    feedbackColor = "text-yellow-600 bg-yellow-50 border-yellow-200";
  } else {
    feedbackTitle = "Marktpreis getroffen";
    feedbackMessage = `Exzellente Preisgestaltung. Sie haben alle ${quantitySold} Einheiten zum Marktpreis von €${marketPrice.toFixed(2)} verkauft.`;
    feedbackColor = "text-green-600 bg-green-50 border-green-200";
  }

  // Marginal Analysis Feedback
  // Fix: Compare against the ACTUAL selling price (User price if < Market), because that is the marginal revenue for the user
  const effectiveSellingPrice = quantitySold > 0 ? (userPrice < marketPrice ? userPrice : marketPrice) : 0;

  let marginalFeedback = "";
  const nextUnitCost = calculateCosts(quantityProduced + 1, fixedCost).mc;
  const currentUnitCost = calculateCosts(quantityProduced, fixedCost).mc;

  if (quantitySold === 0) {
      marginalFeedback = "Da Sie nichts verkauft haben, ist Ihre Grenzanalyse irrelevant. Ihre Priorität muss sein, den Marktpreis zu treffen!";
  } else if (currentUnitCost > effectiveSellingPrice) {
    marginalFeedback = `Warnung: Sie haben ${quantityProduced.toLocaleString()} Einheiten produziert. Die letzte Einheit kostete Sie €${currentUnitCost.toFixed(2)} in der Herstellung (GK). Sie haben sie für €${effectiveSellingPrice.toFixed(2)} verkauft. Das ist ein Verlustgeschäft für diese letzte Einheit!`;
  } else if (nextUnitCost < effectiveSellingPrice) {
    marginalFeedback = `Chance: Die nächste Einheit (#${(quantityProduced + 1).toLocaleString()}) hätte nur €${nextUnitCost.toFixed(2)} gekostet, und Sie haben für Ihre Einheiten €${effectiveSellingPrice.toFixed(2)} erhalten. Sie hätten mehr produzieren sollen!`;
  } else {
    marginalFeedback = `Perfekte Menge! Ihre Grenzkosten (€${currentUnitCost.toFixed(2)}) entsprechen Ihrem Verkaufspreis (€${effectiveSellingPrice.toFixed(2)}). Sie haben den Gewinn maximiert.`;
  }

  // Special feedback for fixed cost shock
  if (isHighFixedCost && profit < 0 && Math.abs(currentUnitCost - effectiveSellingPrice) < 5) {
     marginalFeedback += " WICHTIG: Obwohl Sie aufgrund der hohen Fixkosten einen Verlust machen, war dies die beste Entscheidung. Fixkosten beeinflussen die Grenzkosten nicht! Weniger zu produzieren hätte Ihren Verlust nur vergrößert.";
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">Rundenergebnisse</h2>
      </div>

      {/* Main Outcome Card */}
      <div className={`p-6 rounded-xl border-l-8 shadow-lg ${feedbackColor} bg-white`}>
        <div className="flex items-start gap-4">
          {userPrice > marketPrice ? <AlertTriangle className="w-8 h-8 shrink-0" /> : 
           userPrice < marketPrice ? <TrendingDown className="w-8 h-8 shrink-0" /> :
           <CheckCircle className="w-8 h-8 shrink-0" />}
          <div>
            <h3 className="text-xl font-bold mb-2">{feedbackTitle}</h3>
            <p className="text-lg">{feedbackMessage}</p>
          </div>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-slate-200 text-center">
          <p className="text-slate-500 text-sm uppercase">Umsatz</p>
          <p className="text-2xl font-bold text-green-600">+€{revenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400">{quantitySold.toLocaleString()} verkauft @ €{effectiveSellingPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-slate-200 text-center">
          <p className="text-slate-500 text-sm uppercase">Gesamtkosten</p>
          <p className="text-2xl font-bold text-red-600">-€{totalCost.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Fix: €{(fixedCost/1000).toFixed(0)}k + Var: €{(totalCost - fixedCost).toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-lg shadow border text-center ${profit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-slate-600 text-sm uppercase font-bold">Reingewinn</p>
          <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {profit >= 0 ? '+' : ''}€{profit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Marginal Insight */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          {isHighFixedCost ? <Info className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          Einsicht des Ökonomen
        </h4>
        <p className="text-blue-800 mb-4">{marginalFeedback}</p>
        <div className="flex flex-wrap gap-4 text-sm text-blue-700 font-mono bg-white/50 p-3 rounded">
          <span>Verkaufspreis: €{effectiveSellingPrice.toFixed(2)}</span>
          <span>Ihre GK (letzte Einheit): €{costData.mc.toFixed(2)}</span>
          <span>Ihre DK: €{costData.atc.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {isLastRound ? "Zum Endergebnis" : "Nächste Runde"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;