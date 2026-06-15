import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../../../core/services/api.services';
import { ConsolidatedReport, TraineeSummary, CategoryInsight } from '../../../shared/models';

@Component({
  selector: 'app-consolidated-report',
  templateUrl: './consolidated-report.component.html',
  styleUrls: ['./consolidated-report.component.scss']
})
export class ConsolidatedReportComponent implements OnInit {
  report: ConsolidatedReport | null = null;
  loading = true;
  error   = '';

  constructor(private scoreSvc: ScoreService) {}

  ngOnInit(): void { this.loadReport(); }

  loadReport(): void {
    this.loading = true;
    this.error   = '';
    this.scoreSvc.getConsolidatedReport().subscribe({
      next: r => { this.report = r; this.loading = false; },
      error: () => { this.error = 'Could not generate report.'; this.loading = false; }
    });
  }

  getStatusColor(s: string): string {
    return { STRONG: '#1A8240', GOOD: '#2A70B2', WATCH: '#BE780E', AT_RISK: '#C22626' }[s] ?? '#5C728C';
  }
  getStatusBg(s: string): string {
    return { STRONG: '#DCFCE7', GOOD: '#EFF6FF', WATCH: '#FEF3C7', AT_RISK: '#FEE2E2' }[s] ?? '#F1F5F9';
  }
  getTrendIcon(t: string): string {
    return { IMPROVING: 'trending_up', DECLINING: 'trending_down', STABLE: 'trending_flat' }[t] ?? 'trending_flat';
  }
  getTrendColor(t: string): string {
    return { IMPROVING: '#1A8240', DECLINING: '#C22626', STABLE: '#94A3B8' }[t] ?? '#94A3B8';
  }
  getHealthColor(h: string): string {
    return { EXCELLENT: '#1A8240', GOOD: '#2A70B2', NEEDS_ATTENTION: '#BE780E', CRITICAL: '#C22626' }[h] ?? '#5C728C';
  }
  getScoreColor(s: number): string { return s >= 75 ? '#1A8240' : s >= 65 ? '#BE780E' : '#C22626'; }
}
