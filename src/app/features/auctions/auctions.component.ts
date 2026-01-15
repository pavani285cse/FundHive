import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../core/services/api.service';
import { Auction } from '../../core/models/chit-fund.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auctions',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './auctions.component.html',
  styleUrl: './auctions.component.css'
})
export class AuctionsComponent implements OnInit {
  private readonly api = inject(ApiService);

  displayedColumns = ['groupId', 'month', 'auctionDate', 'winnerMemberId', 'bidAmount', 'prizeAmount'];
  auctions$!: Observable<Auction[]>;

  ngOnInit(): void {
    this.auctions$ = this.api.getAuctions();
  }
}

