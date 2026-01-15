import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../core/services/api.service';
import { Contribution, Penalty } from '../../core/models/chit-fund.models';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface PaymentRow {
  id: number;
  groupId: number;
  memberId: number;
  month: number;
  amount: number;
  status: string;
  penaltyAmount: number;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  private readonly api = inject(ApiService);

  displayedColumns = ['groupId', 'memberId', 'month', 'amount', 'penaltyAmount', 'status'];
  rows$!: Observable<PaymentRow[]>;

  ngOnInit(): void {
    const contributions$ = this.api.getContributions();
    const penalties$ = this.api.getPenalties();

    this.rows$ = combineLatest([contributions$, penalties$]).pipe(
      map(([contributions, penalties]) =>
        contributions.map<PaymentRow>((c: Contribution) => {
          const penalty = penalties.find(
            (p: Penalty) => p.groupId === c.groupId && p.memberId === c.memberId && p.month === c.month
          );
          return {
            id: c.id,
            groupId: c.groupId,
            memberId: c.memberId,
            month: c.month,
            amount: c.amount,
            status: c.status,
            penaltyAmount: penalty?.amount ?? 0
          };
        })
      )
    );
  }
}

