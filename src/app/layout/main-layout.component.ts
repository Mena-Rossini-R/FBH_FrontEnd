// layout/main-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { AuthResponse } from '../shared/models';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  sidebarOpen = true;

  trainerLinks = [
    { path: '/trainer/dashboard', icon: 'dashboard',  label: 'Dashboard' },
    { path: '/trainer/upload',    icon: 'upload_file', label: 'Bulk Upload' },
    { path: '/trainer/pods',      icon: 'groups',      label: 'Pod Manager' },
    { path: '/trainer/students', icon: 'people',      label: 'Student Directory' },
    { path: '/trainer/activity',  icon: 'history',     label: 'Activity Log' },
    { path: '/trainer/feedback', icon: 'chat', label: 'Student Feedback' },
    { path: '/trainer/agent',    icon: 'psychology',  label: 'AI Report',   badge: true },
    
  ];

  traineeLinks = [
    { path: '/trainee/dashboard',  icon: 'dashboard',     label: 'My Dashboard' },
    { path: '/trainee/scorecards', icon: 'assignment',    label: 'My Scorecards' },
    { path: '/trainee/feedback',   icon: 'chat',          label: 'Feedback Thread' },
    { path: '/trainee/alerts',     icon: 'notifications', label: 'Skill Alerts' },
    { path: '/trainee/cohort',           icon: 'group',       label: 'My Cohort' },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    if (this.router.url === '/') {
      this.router.navigate([this.auth.isTrainer() ? '/trainer/dashboard' : '/trainee/dashboard']);
    }
  }

  get navLinks() { return this.auth.isTrainer() ? this.trainerLinks : this.traineeLinks; }
  logout(): void { this.auth.logout(); }
  toggle(): void { this.sidebarOpen = !this.sidebarOpen; }
}
