// features/trainee/dashboard/trainee-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardService, AlertService } from '../../../core/services/api.services';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardStats } from '../../../shared/models';

@Component({
  selector: 'app-trainee-dashboard',
  templateUrl: './trainee-dashboard.component.html',
  styleUrls: ['./trainee-dashboard.component.scss']
})
export class TraineeDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  alertCount = 0;
  loading = true;

  weeklyEntries: { week: string; score: number }[] = [];

  constructor(
    private dashSvc: DashboardService,
    private alertSvc: AlertService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.auth.getCurrentUser()?.userId;
    if (userId) {
      this.dashSvc.getTraineeDashboard(userId).subscribe({
        next: (d) => {
          this.stats = d;
          this.weeklyEntries = Object.entries(d.weeklyTrend ?? {})
            .map(([week, score]) => ({ week, score }))
            .sort((a, b) => a.week.localeCompare(b.week));
          this.loading = false;
        },
        error: () => this.loading = false
      });
      this.alertSvc.getAlerts(userId).subscribe({
        next: (alerts) => this.alertCount = alerts.filter(a => !a.acknowledged).length,
        error: () => {}
      });
    }
  }

  get progressPercent(): number {
    return Math.min(this.stats?.overallProgress ?? 0, 100);
  }

  getBarHeight(score: number): number { return (score / 100) * 120; }
  getBarColor(score: number): string {
    return score >= 75 ? '#1A8240' : score >= 65 ? '#BE780E' : '#C22626';
  }
  getActivityIcon(type: string): string {
    switch (type) {
      case 'SCORE_UPLOADED': return 'assignment';
      case 'FEEDBACK_GIVEN': return 'chat';
      case 'FEEDBACK_VIEWED': return 'visibility';
      case 'ALERT_CREATED': return 'notifications';
      default: return 'info';
    }
  }
}
