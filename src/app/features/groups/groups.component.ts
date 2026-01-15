import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../core/services/api.service';
import { ChitGroup } from '../../core/models/chit-fund.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit {
  private readonly api = inject(ApiService);

  displayedColumns = ['name', 'totalValue', 'durationMonths', 'monthlyContribution', 'status'];
  groups$!: Observable<ChitGroup[]>;

  ngOnInit(): void {
    this.groups$ = this.api.getChitGroups();
  }
}

