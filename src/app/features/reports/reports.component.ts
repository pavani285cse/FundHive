import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ApiService } from '../../core/services/api.service';
import { Contribution, Payout, Penalty } from '../../core/models/chit-fund.models';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgChartsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  private readonly api = inject(ApiService);

  collectionsVsPayoutsData!: ChartConfiguration<'bar'>['data'];
  penaltiesData!: ChartConfiguration<'pie'>['data'];

  ngOnInit(): void {
    const contributions$ = this.api.getContributions();
    const payouts$ = this.api.getPayouts();
    const penalties$ = this.api.getPenalties();

    combineLatest([contributions$, payouts$, penalties$])
      .pipe(
        map(([contributions, payouts, penalties]) => {
          const totalCollected = contributions.reduce((sum: number, c: Contribution) => sum + c.amount, 0);
          const totalPayouts = payouts.reduce((sum: number, p: Payout) => sum + p.amount, 0);

          this.collectionsVsPayoutsData = {
            labels: ['Totals'],
            datasets: [
              { data: [totalCollected], label: 'Collected', backgroundColor: '#4caf50' },
              { data: [totalPayouts], label: 'Payouts', backgroundColor: '#f44336' }
            ]
          };

          const unpaidPenalties = penalties
            .filter((p: Penalty) => p.status === 'unpaid')
            .reduce((sum: number, p: Penalty) => sum + p.amount, 0);
          const paidPenalties = penalties
            .filter((p: Penalty) => p.status === 'paid')
            .reduce((sum: number, p: Penalty) => sum + p.amount, 0);

          this.penaltiesData = {
            labels: ['Unpaid', 'Paid'],
            datasets: [
              {
                data: [unpaidPenalties, paidPenalties],
                backgroundColor: ['#ff9800', '#3f51b5']
              }
            ]
          };
        })
      )
      .subscribe();
  }
}

