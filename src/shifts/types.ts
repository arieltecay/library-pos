export interface CashShift {
  id: string;
  seller: string;
  openedAt: string;
  closedAt?: string;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;
  status: "open" | "closed";
  note?: string;
}

export interface ShiftAggregated {
  cashTotal: number;
  transferTotal: number;
  creditTotal: number;
  salesCount: number;
  productsSold: number;
  avgTicket: number;
  expectedCash: number;
}