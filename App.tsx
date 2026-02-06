import React, { useState } from 'react';
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import EndScreen from './components/EndScreen';
import { GamePhase, PlayerHistory } from './types';
import { ROUND_SCENARIOS, calculateCosts, DEFAULT_FIXED_COST } from './constants';

function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.INTRO);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [history, setHistory] = useState<PlayerHistory[]>([]);

  const cumulativeProfit = history.reduce((acc, curr) => acc + curr.profit, 0);

  const handleStart = () => {
    setPhase(GamePhase.PLAYING);
  };

  const handleSubmitRound = (userPrice: number, quantityProduced: number) => {
    const roundData = ROUND_SCENARIOS[currentRoundIndex];
    const { marketPrice, fixedCostOverride } = roundData;
    const currentFixedCost = fixedCostOverride ?? DEFAULT_FIXED_COST;
    
    // Core Game Logic
    let quantitySold = 0;
    
    // Strict price taking: If price > market, sell 0. 
    // If price <= market, sell everything produced (assuming demand is infinite at market price for a small firm)
    if (userPrice > marketPrice) {
      quantitySold = 0;
    } else {
      quantitySold = quantityProduced;
    }

    // Revenue calculation
    // Note: If user priced BELOW market, they get their asking price, not the market price (leaving money on table)
    const activePrice = userPrice <= marketPrice ? userPrice : 0; 
    const revenue = quantitySold * activePrice;

    // Cost calculation (costs incurred regardless of sales)
    const { tc } = calculateCosts(quantityProduced, currentFixedCost);
    
    const profit = revenue - tc;

    const roundResult: PlayerHistory = {
      roundNumber: roundData.roundNumber,
      marketPrice,
      userPrice,
      quantityProduced,
      quantitySold,
      revenue,
      totalCost: tc,
      profit,
      optimalProfit: roundData.optimalProfit,
      fixedCost: currentFixedCost
    };

    setHistory([...history, roundResult]);
    setPhase(GamePhase.RESULT);
  };

  const handleNextRound = () => {
    if (currentRoundIndex < ROUND_SCENARIOS.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setPhase(GamePhase.PLAYING);
    } else {
      setPhase(GamePhase.END);
    }
  };

  const handleRestart = () => {
    setCurrentRoundIndex(0);
    setHistory([]);
    setPhase(GamePhase.INTRO);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-blue-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center gap-2 text-slate-800">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif">S</span>
            SunBright Solar
          </div>
          <div className="text-sm text-slate-500 font-medium">
             Mikroökonomie Simulation
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        {phase === GamePhase.INTRO && (
          <IntroScreen onStart={handleStart} />
        )}

        {phase === GamePhase.PLAYING && (
          <GameScreen 
            roundData={ROUND_SCENARIOS[currentRoundIndex]}
            roundIndex={currentRoundIndex}
            cumulativeProfit={cumulativeProfit}
            onSubmit={handleSubmitRound}
          />
        )}

        {phase === GamePhase.RESULT && (
          <ResultScreen 
            history={history}
            onNext={handleNextRound}
            isLastRound={currentRoundIndex === ROUND_SCENARIOS.length - 1}
          />
        )}

        {phase === GamePhase.END && (
          <EndScreen 
            history={history}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}

export default App;