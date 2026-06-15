import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../../../core/services/api.services';
import { AuthService } from '../../../core/services/auth.service';
import { ScoreResponse } from '../../../shared/models';

@Component({
  selector: 'app-scorecards',
  templateUrl: './scorecards.component.html',
  styleUrls: ['./scorecards.component.scss']
})
export class ScorecardsComponent implements OnInit {
  scores: ScoreResponse[] = [];
  loading = true;
  displayedColumns = ['assignmentName','category','score','grade','weekLabel','submittedDate','trend','actions'];

  // AI Feedback
  selectedScore: ScoreResponse | null = null;
  aiFeedbackText = '';
  loadingFeedback = false;

  constructor(private scoreSvc: ScoreService, private auth: AuthService) {}

  ngOnInit(): void {
    const userId = this.auth.getCurrentUser()?.userId;
    if (!userId) return;
    this.scoreSvc.getTraineeScores(userId).subscribe({
      next: d => { this.scores = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  viewAiFeedback(score: ScoreResponse): void {
    if (this.selectedScore?.id === score.id) { this.selectedScore = null; return; }
    this.selectedScore = score;
    this.aiFeedbackText = '';
    this.loadingFeedback = true;
    this.scoreSvc.getAiFeedback(score.id).subscribe({
      next: r => { this.aiFeedbackText = r.feedback; this.loadingFeedback = false; },
      error: () => { this.aiFeedbackText = 'Could not generate feedback. Please try again.'; this.loadingFeedback = false; }
    });
  }

  formatFeedback(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  get avgScore(): number  { return this.scores.length ? this.scores.reduce((s,x)=>s+x.score,0)/this.scores.length : 0; }
  get bestScore(): number { return this.scores.length ? Math.max(...this.scores.map(s=>s.score)) : 0; }
  get lowScore():  number { return this.scores.length ? Math.min(...this.scores.map(s=>s.score)) : 0; }

  getScoreClass(s: number): string   { return s>=75?'score-green':s>=65?'score-amber':'score-red'; }
  getScoreColor(s: number): string   { return s>=75?'#059669':s>=65?'#D97706':'#DC2626'; }
  getTrendIcon(t: string): string    { return t==='UP'?'trending_up':t==='DOWN'?'trending_down':'trending_flat'; }
  getTrendColor(t: string): string   { return t==='UP'?'#059669':t==='DOWN'?'#DC2626':'#94A3B8'; }
  getCategoryColor(cat: string): string {
    const m: Record<string,string> = {
      'Technical':'#2A70B2','Testing':'#C22626','Communication':'#1A8240',
      'Project Mgmt':'#12987A','Process':'#6838A8','Collaboration':'#BE780E'
    };
    return m[cat] ?? '#5C728C';
  }
}
