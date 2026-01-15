import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  title = 'Chit Fund Management';
  isHandset = false; // placeholder; could be wired with BreakpointObserver
  currentUser: string | null = null;
  userRole: string | null = null;
  showSidebar = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.authService.getUserRole();
    
    // Update sidebar visibility based on route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showSidebar = event.url !== '/login' && this.authService.isAuthenticated();
        // Update user info on navigation
        this.currentUser = this.authService.getCurrentUser();
        this.userRole = this.authService.getUserRole();
      });
    
    // Initial check
    this.showSidebar = this.router.url !== '/login' && this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
