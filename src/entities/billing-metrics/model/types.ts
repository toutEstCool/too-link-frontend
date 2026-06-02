export interface SubscriberStats {
  total: number;
  active: number;
  suspended: number;
  grace: number;
}

export interface FinancialStats {
  currentPoolSom: number;
  totalCollectedSom: number;
}

export interface NetworkStats {
  activeSessions: number;
}

export interface BillingStats {
  subscribers: SubscriberStats;
  financials: FinancialStats;
  network: NetworkStats;
}
