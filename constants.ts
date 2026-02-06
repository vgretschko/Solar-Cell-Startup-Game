import { CostData, RoundScenario } from './types';

// --- Cost Functions ---
// Medium Size Factory Model
// Target: Min ATC at Q=5,000, Price=€150.
// Standard FC = €375,000
// VC = 0.015 * q^2
// TC = FC + 0.015 * q^2
// MC = 0.03 * q
// ATC = FC/q + 0.015 * q

export const DEFAULT_FIXED_COST = 375000;

export const calculateCosts = (q: number, currentFixedCost: number = DEFAULT_FIXED_COST): CostData => {
  const vc = 0.015 * Math.pow(q, 2);
  const tc = currentFixedCost + vc;
  const mc = 0.03 * q;
  const atc = q === 0 ? 0 : tc / q; 

  return { q, tc, mc, atc, vc };
};

// Generate default reference table data for initial charts
export const DEFAULT_COST_CURVE_DATA: CostData[] = Array.from({ length: 101 }, (_, i) => calculateCosts(i * 100)).filter(d => d.q >= 500);

export const generateCostCurveData = (fixedCost: number) => {
  return Array.from({ length: 101 }, (_, i) => calculateCosts(i * 100, fixedCost)).filter(d => d.q >= 500);
};

// --- Game Scenarios ---
export const ROUND_SCENARIOS: RoundScenario[] = [
  {
    roundNumber: 1,
    marketPrice: 180,
    newsHeadline: "Starke Nachfrage! Länder treiben Ziele für erneuerbare Energien voran.",
    optimalQuantity: 6000,
    optimalProfit: 165000
  },
  {
    roundNumber: 2,
    marketPrice: 165,
    newsHeadline: "Erste neue Wettbewerber treten in den Markt ein, angezogen von den hohen Gewinnen.",
    optimalQuantity: 5500,
    optimalProfit: 78750
  },
  {
    roundNumber: 3,
    marketPrice: 150,
    newsHeadline: "Marktgleichgewicht erreicht. Preise entsprechen nun den minimalen Durchschnittskosten.",
    optimalQuantity: 5000,
    optimalProfit: 0
  },
  {
    // THE LESSON ROUND: Fixed Costs rise, but MC stays same. Optimal Q should NOT change.
    roundNumber: 4,
    marketPrice: 150,
    newsHeadline: "SCHLECHTE NACHRICHTEN: Die Industriemieten haben sich verdoppelt! Ihre Fixkosten steigen massiv.",
    optimalQuantity: 5000,
    optimalProfit: -125000, // Loss minimization
    fixedCostOverride: 500000 // Higher fixed cost
  },
  {
    roundNumber: 5,
    marketPrice: 210,
    newsHeadline: "EILMELDUNG: Massive staatliche Subventionen lösen einen Nachfrageboom aus!",
    optimalQuantity: 7000,
    optimalProfit: 360000 // Calculated with normal FC (assuming rent shock was temporary or subsidies offset it? Let's assume rent goes back to normal or we keep it high? Let's go back to normal for simplicity of comparing demand shock)
    // Actually, usually in games, shocks are temporary or specific. Let's revert to normal FC for simplicity unless specified.
  },
  {
    roundNumber: 6,
    marketPrice: 135,
    newsHeadline: "Rezession! Die Nachfrage bricht ein, Überangebot auf dem Markt.",
    optimalQuantity: 4500,
    optimalProfit: -71250
  },
  {
    roundNumber: 7,
    marketPrice: 150,
    newsHeadline: "Der Markt erholt sich langsam und kehrt zum langjährigen Mittelwert zurück.",
    optimalQuantity: 5000,
    optimalProfit: 0
  },
  {
    roundNumber: 8,
    marketPrice: 165,
    newsHeadline: "Ein großer Konkurrent geht bankrott, Preise steigen leicht an.",
    optimalQuantity: 5500,
    optimalProfit: 78750
  }
];

// Sum of all optimal profits
export const MAX_TOTAL_PROFIT = ROUND_SCENARIOS.reduce((acc, r) => acc + r.optimalProfit, 0);