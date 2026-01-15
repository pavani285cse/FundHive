import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { GroupsComponent } from './features/groups/groups.component';
import { MembersComponent } from './features/members/members.component';
import { AuctionsComponent } from './features/auctions/auctions.component';
import { PaymentsComponent } from './features/payments/payments.component';
import { ReportsComponent } from './features/reports/reports.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'groups', 
    component: GroupsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'members', 
    component: MembersComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'auctions', 
    component: AuctionsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'payments', 
    component: PaymentsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'reports', 
    component: ReportsComponent,
    canActivate: [authGuard]
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
