import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/chit-fund.models';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  summary$!: Observable<DashboardSummary>;
  loading = true;

  monthlyCollectionsChartData!: ChartConfiguration<'line'>['data'];
  paidVsPendingChartData!: ChartConfiguration<'pie'>['data'];

  // Chart options
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    }
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: false
      }
    }
  };

  ngOnInit(): void {
    // Fetch dashboard summary
    this.summary$ = this.dashboardService.getDashboardSummary();

    // Fetch chart data
    combineLatest([
      this.dashboardService.getMonthlyCollections(),
      this.dashboardService.getPaidVsPendingMembers()
    ]).subscribe(([monthlyData, memberData]) => {
      // Line chart: Monthly Collections
      this.monthlyCollectionsChartData = {
        labels: monthlyData.labels,
        datasets: [
          {
            label: 'Monthly Collections',
            data: monthlyData.data,
            borderColor: '#3f51b5',
            backgroundColor: 'rgba(63, 81, 181, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3f51b5',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#3f51b5'
          }
        ]
      };

      // Pie chart: Paid vs Pending Members
      this.paidVsPendingChartData = {
        labels: ['Paid Members', 'Pending Members'],
        datasets: [
          {
            data: [memberData.paid, memberData.pending],
            backgroundColor: ['#4caf50', '#ff9800'],
            hoverBackgroundColor: ['#45a049', '#e68900'],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      };

      this.loading = false;
    });
  }
}

