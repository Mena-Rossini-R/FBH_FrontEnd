// features/trainee/cohort/cohort-info.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ScoreService } from '../../../core/services/api.services';
import { AuthResponse, ScoreResponse } from '../../../shared/models';

@Component({
  selector: 'app-cohort-info',
  templateUrl: './cohort-info.component.html',
  styleUrls: ['./cohort-info.component.scss']
})
export class CohortInfoComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  podScores: ScoreResponse[] = [];
  loading = true;

  constructor(private auth: AuthService, private scoreSvc: ScoreService) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    const userId = this.auth.getCurrentUser()?.userId;
    if (!userId) return;
    this.scoreSvc.getScoresByTrainee(userId).subscribe({
      next: (d: ScoreResponse[]) => { this.podScores = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get avgScore(): number {
    if (!this.podScores.length) return 0;
    return this.podScores.reduce((s, r) => s + r.score, 0) / this.podScores.length;
  }

  getScoreClass(score: number): string {
    return score >= 75 ? 'score-green' : score >= 65 ? 'score-amber' : 'score-red';
  }
}
