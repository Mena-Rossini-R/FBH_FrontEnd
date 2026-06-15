// features/trainer/dashboard/trainer-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/api.services';
import { DashboardStats } from '../../../shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trainer-dashboard',
  templateUrl: './trainer-dashboard.component.html',
  styleUrls: ['./trainer-dashboard.component.scss']
})
export class TrainerDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private dashSvc: DashboardService, private snack: MatSnackBar) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.dashSvc.getTrainerDashboard().subscribe({
      next: (d) => { this.stats = d; this.loading = false; },
      error: (err: any) => { 
        this.loading = false; 
        console.error('Dashboard load error:', err);
        const message = err.error?.message || err.message || 'Failed to load dashboard';
        this.snack.open(message, 'Close', { duration: 5000 }); 
      }
    });
  }

  getScoreClass(score: number): string {
    return score >= 75 ? 'score-green' : score >= 65 ? 'score-amber' : 'score-red';
  }

  getPodEntries(): { pod: string; avg: number }[] {
    if (!this.stats?.podAverages) return [];
    return Object.entries(this.stats.podAverages).map(([pod, avg]) => ({ pod, avg }));
  }

  getActivityIcon(type: string): string {
    const m: Record<string, string> = {
      SCORE_UPLOADED: 'upload', BULK_UPLOAD: 'upload_file',
      FEEDBACK_GIVEN: 'comment', FEEDBACK_VIEWED: 'visibility'
    };
    return m[type] ?? 'info';
  }
}
