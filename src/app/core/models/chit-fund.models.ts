export type MemberStatus = 'active' | 'inactive';

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: MemberStatus;
}

export type ChitGroupStatus = 'planned' | 'running' | 'completed' | 'closed';

export interface ChitGroup {
  id: number;
  name: string;
  totalValue: number;
  durationMonths: number;
  monthlyContribution: number;
  startDate: string; // ISO date string
  status: ChitGroupStatus;
}

export type ContributionStatus = 'pending' | 'paid' | 'late';

export interface Contribution {
  id: number;
  groupId: number;
  memberId: number;
  month: number;
  amount: number;
  date: string; // ISO date
  status: ContributionStatus;
}

export interface Auction {
  id: number;
  groupId: number;
  month: number;
  auctionDate: string; // ISO date
  winnerMemberId: number;
  bidAmount: number;
  prizeAmount: number;
  discount: number;
}

export type PayoutStatus = 'pending' | 'paid';

export interface Payout {
  id: number;
  groupId: number;
  memberId: number;
  auctionId: number;
  amount: number;
  payoutDate: string; // ISO date
  status: PayoutStatus;
}

export type PenaltyStatus = 'unpaid' | 'paid' | 'waived';

export interface Penalty {
  id: number;
  groupId: number;
  memberId: number;
  month: number;
  amount: number;
  reason: string;
  status: PenaltyStatus;
}

export interface DashboardSummary {
  totalGroups: number;
  totalMembers: number;
  monthlyCollectionAmount: number;
  pendingPayments: number;
}

