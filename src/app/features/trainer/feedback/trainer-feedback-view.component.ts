import { Component, OnInit } from '@angular/core';
import { FeedbackService, ScoreService } from '../../../core/services/api.services';
import { ScoreResponse, FeedbackResponse } from '../../../shared/models';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trainer-feedback-view',
  templateUrl: './trainer-feedback-view.component.html',
  styleUrls: ['./trainer-feedback-view.component.scss']
})
export class TrainerFeedbackViewComponent implements OnInit {
  scores: ScoreResponse[] = [];
  selectedScore: ScoreResponse | null = null;
  messages: FeedbackResponse[] = [];
  messageCtrl = new FormControl('', Validators.required);
  loading = false;
  sending = false;

  constructor(
    private feedbackSvc: FeedbackService,
    private scoreSvc: ScoreService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadScoresWithFeedback();
  }

  loadScoresWithFeedback(): void {
    this.loading = true;
    this.scoreSvc.getTrainerScores().subscribe({
      next: (scores) => {
        // Filter scores that have feedback
        this.scores = scores.filter(s => s.feedbackStatus === 'PENDING' || s.feedbackStatus === 'VIEWED' || s.feedbackStatus === 'ACKNOWLEDGED');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Failed to load feedback', 'Close', { duration: 3000 });
      }
    });
  }

  selectScore(score: ScoreResponse): void {
    this.selectedScore = score;
    this.loading = true;
    this.feedbackSvc.getThread(score.id).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Failed to load conversation', 'Close', { duration: 3000 });
      }
    });
  }

  sendReply(): void {
    if (!this.messageCtrl.value?.trim() || !this.selectedScore) return;
    this.sending = true;
    this.feedbackSvc.addMessage(this.selectedScore.id, this.messageCtrl.value.trim()).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.messageCtrl.reset();
        this.sending = false;
      },
      error: () => {
        this.sending = false;
        this.snack.open('Failed to send reply', 'Close', { duration: 3000 });
      }
    });
  }

  isTrainer(senderRole: string): boolean {
    return senderRole === 'TRAINER';
  }
}