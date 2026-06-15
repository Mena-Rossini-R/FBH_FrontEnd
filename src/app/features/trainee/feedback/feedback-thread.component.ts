// features/trainee/feedback/feedback-thread.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackService, ScoreService } from '../../../core/services/api.services';
import { AuthService } from '../../../core/services/auth.service';
import { FeedbackResponse, ScoreResponse } from '../../../shared/models';

@Component({
  selector: 'app-feedback-thread',
  templateUrl: './feedback-thread.component.html',
  styleUrls: ['./feedback-thread.component.scss']
})
export class FeedbackThreadComponent implements OnInit {
  scores: ScoreResponse[] = [];
  selectedScore: ScoreResponse | null = null;
  messages: FeedbackResponse[] = [];
  messageCtrl = new FormControl('', Validators.required);
  loading = false;
  sending = false;
  selectedScoreId: number | null = null;

  constructor(
    private feedbackSvc: FeedbackService,
    private scoreSvc: ScoreService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userId = this.auth.getCurrentUser()?.userId;
    if (!userId) return;

    this.scoreSvc.getScoresByTrainee(userId).subscribe({
      next: (d: ScoreResponse[]) => {
        this.scores = d;
        const qsId = this.route.snapshot.queryParamMap.get('scoreId');
        if (qsId) this.selectScore(Number(qsId));
      },
      error: () => {}
    });
  }

  selectScore(scoreId: number): void {
    this.selectedScoreId = scoreId;
    this.selectedScore = this.scores.find(s => s.id === scoreId) ?? null;
    this.loading = true;
    this.feedbackSvc.getThread(scoreId).subscribe({
      next: (msgs) => { this.messages = msgs; this.loading = false; },
      error: () => this.loading = false
    });
  }

  send(): void {
    if (!this.messageCtrl.value?.trim() || !this.selectedScoreId) return;
    this.sending = true;
    this.feedbackSvc.addMessage(this.selectedScoreId, this.messageCtrl.value.trim()).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.messageCtrl.reset();
        this.sending = false;
      },
      error: (err) => { this.sending = false; this.snack.open(err.error?.error ?? 'Send failed', 'Close', { duration: 3000 }); }
    });
  }

  isTrainer(senderRole: string): boolean { return senderRole === 'TRAINER'; }
}
