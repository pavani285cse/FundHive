import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../core/services/api.service';
import { Member } from '../../core/models/chit-fund.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {
  private readonly api = inject(ApiService);

  displayedColumns = ['name', 'email', 'phone', 'status'];
  members$!: Observable<Member[]>;

  ngOnInit(): void {
    this.members$ = this.api.getMembers();
  }
}

