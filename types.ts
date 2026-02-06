export interface RoundScenario {
  roundNumber: number;
  marketPrice: number;
  newsHeadline: string;
  optimalQuantity: number;
  optimalProfit: number;
  fixedCostOverride?: number; // Optional: If defined, this round has different fixed costs
}

export interface PlayerHistory {
  roundNumber: number;
  marketPrice: number;
  userPrice: number;
  quantityProduced: number;
  quantitySold: number;
  revenue: number;
  totalCost: number;
  profit: number;
  optimalProfit: number;
  fixedCost: number; // Store what the fixed cost was for this round
}

export interface CostData {
  q: number;
  tc: number; // Total Cost
  mc: number; // Marginal Cost
  atc: number; // Average Total Cost
  vc: number; // Variable Cost
}

export enum GamePhase {
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT',
  END = 'END'
}