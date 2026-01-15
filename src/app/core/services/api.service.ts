import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import {
  Auction,
  ChitGroup,
  Contribution,
  DashboardSummary,
  Member,
  Penalty,
  Payout
} from '../models/chit-fund.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3001';

  // Members
  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}/members`);
  }

  // Chit Groups
  getChitGroups(): Observable<ChitGroup[]> {
    return this.http.get<ChitGroup[]>(`${this.baseUrl}/chitGroups`);
  }

  // Contributions
  getContributions(): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(`${this.baseUrl}/contributions`);
  }

  // Auctions
  getAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.baseUrl}/auctions`);
  }

  // Payouts
  getPayouts(): Observable<Payout[]> {
    return this.http.get<Payout[]>(`${this.baseUrl}/payouts`);
  }

  // Penalties
  getPenalties(): Observable<Penalty[]> {
    return this.http.get<Penalty[]>(`${this.baseUrl}/penalties`);
  }

  // Simple dashboard summary derived on client for now
  // Note: This method is deprecated - use DashboardService instead
  getDashboardSummary(): Observable<DashboardSummary> {
    return combineLatest([
      this.getChitGroups(),
      this.getMembers(),
      this.getContributions()
    ]).pipe(
      map(([groups, members, contributions]) => {
        // Calculate monthly collection amount (current month)
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const monthlyCollection = contributions
          .filter(c => {
            const contribDate = new Date(c.date);
            return contribDate.getMonth() + 1 === currentMonth &&
                   contribDate.getFullYear() === currentYear &&
                   c.status === 'paid';
          })
          .reduce((sum, c) => sum + c.amount, 0);

        // Calculate pending payments
        const pendingPayments = contributions
          .filter(c => c.status === 'pending' || c.status === 'late')
          .reduce((sum, c) => sum + c.amount, 0);

        return {
          totalGroups: groups.length,
          totalMembers: members.length,
          monthlyCollectionAmount: monthlyCollection,
          pendingPayments: pendingPayments
        };
      })
    );
  }
}

