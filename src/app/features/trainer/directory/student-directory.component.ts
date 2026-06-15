import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ScoreService } from '../../../core/services/api.services';
import { ScoreResponse } from '../../../shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-directory',
  templateUrl: './student-directory.component.html',
  styleUrls: ['./student-directory.component.scss']
})
export class StudentDirectoryComponent implements OnInit {
  displayedColumns = ['traineeName','traineeEmail','podName','assignmentName','score','grade','trend','feedbackStatus','actions'];
  dataSource = new MatTableDataSource<ScoreResponse>([]);
  loading = false;
  searchTerm = '';
  podFilter = '';
  pods: string[] = [];

  // AI Feedback panel
  selectedScore: ScoreResponse | null = null;
  aiFeedbackText = '';
  loadingFeedback = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!: MatSort;

  constructor(private scoreSvc: ScoreService, private snack: MatSnackBar) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.scoreSvc.getTrainerScores().subscribe({
      next: d => {
        this.dataSource.data = d;
        this.pods = [...new Set(d.map(s => s.podName).filter(Boolean))];
        setTimeout(() => { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilter(): void {
    const f = this.searchTerm.trim().toLowerCase();
    const p = this.podFilter;
    this.dataSource.filterPredicate = (row: ScoreResponse) => {
      const matchText = !f || row.traineeName.toLowerCase().includes(f) || row.traineeEmail.toLowerCase().includes(f);
      const matchPod  = !p || row.podName === p;
      return matchText && matchPod;
    };
    this.dataSource.filter = f + p; // trigger re-filter
  }

  viewAiFeedback(score: ScoreResponse): void {
    this.selectedScore = score;
    this.aiFeedbackText = '';
    this.loadingFeedback = true;
    this.scoreSvc.getAiFeedback(score.id).subscribe({
      next: r => { this.aiFeedbackText = r.feedback; this.loadingFeedback = false; },
      error: () => { this.loadingFeedback = false; this.snack.open('Could not load AI feedback', 'Close', { duration: 3000 }); }
    });
  }

  closeFeedback(): void { this.selectedScore = null; this.aiFeedbackText = ''; }

  formatFeedback(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  getScoreColor(s: number): string { return s >= 75 ? '#059669' : s >= 65 ? '#D97706' : '#DC2626'; }
  getScoreClass(s: number): string { return s >= 75 ? 'score-green' : s >= 65 ? 'score-amber' : 'score-red'; }
  getTrendIcon(t: string): string  { return t==='UP'?'trending_up':t==='DOWN'?'trending_down':'trending_flat'; }
  getTrendClass(t: string): string { return t==='UP'?'trend-up':t==='DOWN'?'trend-down':'trend-stable'; }
}
