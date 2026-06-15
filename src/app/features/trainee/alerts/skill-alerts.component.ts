import { Component, OnInit } from '@angular/core';
import { AlertService, ScoreService } from '../../../core/services/api.services';
import { AuthService } from '../../../core/services/auth.service';
import { AlertResponse } from '../../../shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-skill-alerts',
  templateUrl: './skill-alerts.component.html',
  styleUrls: ['./skill-alerts.component.scss']
})
export class SkillAlertsComponent implements OnInit {
  alerts: AlertResponse[] = [];
  loading = true;
  loadingAnalysis = false;
  skillsGapAnalysis = '';
  analysisError = '';

  constructor(
    private alertSvc: AlertService,
    private scoreSvc: ScoreService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userId = this.auth.getCurrentUser()?.userId;
    if (!userId) return;

    this.alertSvc.getAlerts(userId).subscribe({
      next: d => { this.alerts = d; this.loading = false; },
      error: () => this.loading = false
    });

    // Auto-load skills gap AI analysis
    this.loadAnalysis(userId);
  }

  loadAnalysis(userId: number): void {
    this.loadingAnalysis = true;
    this.scoreSvc.getSkillsGap(userId).subscribe({
      next: r => { this.skillsGapAnalysis = r.analysis; this.loadingAnalysis = false; },
      error: () => { this.analysisError = 'Could not generate analysis.'; this.loadingAnalysis = false; }
    });
  }

  refreshAnalysis(): void {
    const userId = this.auth.getCurrentUser()?.userId;
    if (userId) this.loadAnalysis(userId);
  }

  acknowledge(alert: AlertResponse): void {
    this.alertSvc.acknowledge(alert.id).subscribe({
      next: u => { const i = this.alerts.findIndex(a => a.id === alert.id); if (i>=0) this.alerts[i]=u; this.snack.open('Acknowledged','Close',{duration:2000}); }
    });
  }

  resolve(alert: AlertResponse): void {
    this.alertSvc.resolve(alert.id).subscribe({
      next: u => { const i = this.alerts.findIndex(a => a.id === alert.id); if (i>=0) this.alerts[i]=u; this.snack.open('Resolved','Close',{duration:2000}); }
    });
  }

  // Format markdown-like text to HTML
  formatAnalysis(text: string): string {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  get critical(): number  { return this.alerts.filter(a => a.alertLevel==='CRITICAL' && !a.resolved).length; }
  get warnings(): number  { return this.alerts.filter(a => a.alertLevel==='WARNING'  && !a.resolved).length; }
  getLevelColor(level: string): string {
    return level==='CRITICAL'?'#C22626':level==='WARNING'?'#BE780E':'#12987A';
  }
}
