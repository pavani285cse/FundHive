import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
  ChitGroup,
  Member,
  Contribution,
  DashboardSummary,
  ContributionStatus
} from '../models/chit-fund.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly api = inject(ApiService);

  /**
   * Get comprehensive dashboard summary
   */
  getDashboardSummary(): Observable<DashboardSummary> {
    return combineLatest([
      this.api.getChitGroups(),
      this.api.getMembers(),
      this.api.getContributions()
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

  /**
   * Get monthly collections data for line chart
   */
  getMonthlyCollections(): Observable<{ labels: string[]; data: number[] }> {
    return this.api.getContributions().pipe(
      map(contributions => {
        // Group by month and calculate totals
        const monthlyData = new Map<string, number>();

        contributions
          .filter(c => c.status === 'paid')
          .forEach(contrib => {
            const date = new Date(contrib.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            if (!monthlyData.has(monthLabel)) {
              monthlyData.set(monthLabel, 0);
            }
            monthlyData.set(monthLabel, monthlyData.get(monthLabel)! + contrib.amount);
          });

        // Sort by date
        const sortedEntries = Array.from(monthlyData.entries()).sort((a, b) => {
          const dateA = new Date(a[0]);
          const dateB = new Date(b[0]);
          return dateA.getTime() - dateB.getTime();
        });

        return {
          labels: sortedEntries.map(([label]) => label),
          data: sortedEntries.map(([, amount]) => amount)
        };
      })
    );
  }

  /**
   * Get paid vs pending members data for pie chart
   */
  getPaidVsPendingMembers(): Observable<{ paid: number; pending: number }> {
    return this.api.getContributions().pipe(
      map(contributions => {
        // Get unique members who have paid
        const paidMemberIds = new Set(
          contributions
            .filter(c => c.status === 'paid')
            .map(c => c.memberId)
        );

        // Get unique members with pending payments
        const pendingMemberIds = new Set(
          contributions
            .filter(c => c.status === 'pending' || c.status === 'late')
            .map(c => c.memberId)
        );

        return {
          paid: paidMemberIds.size,
          pending: pendingMemberIds.size
        };
      })
    );
  }
}
