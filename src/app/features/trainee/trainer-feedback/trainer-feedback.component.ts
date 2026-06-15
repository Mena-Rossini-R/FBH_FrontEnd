import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { FeedbackService, ScoreService } from '../../../core/services/api.services';
import { ScoreResponse } from '../../../shared/models';

@Component({
  selector: 'app-trainer-feedback',
  templateUrl: './trainer-feedback.component.html',
  styleUrls: ['./trainer-feedback.component.scss']
})
export class TrainerFeedbackComponent implements OnInit {
  scores:    ScoreResponse[] = [];
  loading    = true;
  submitting = false;

  feedbackForm: FormGroup;
  selectedScoreId: number | null = null;
  submittedFeedbacks: number[]   = [];

  // Questions from tecstac portal — placeholder, to be filled when received
  feedbackQuestions = [
    { id: 1, question: 'How well did the trainer explain the concepts?', type: 'rating' },
    { id: 2, question: 'How would you rate the quality of study material provided?', type: 'rating' },
    { id: 3, question: 'How effective were the practice sessions?', type: 'rating' },
    { id: 4, question: 'Was the trainer approachable and helpful for doubt clarification?', type: 'rating' },
    { id: 5, question: 'Additional comments or suggestions for the trainer', type: 'text' },
  ];

  constructor(
    private auth:       AuthService,
    private scoreSvc:   ScoreService,
    private feedbackSvc:FeedbackService,
    private fb:         FormBuilder,
    private snack:      MatSnackBar
  ) {
    this.feedbackForm = this.fb.group({
      q1: [null, Validators.required],
      q2: [null, Validators.required],
      q3: [null, Validators.required],
      q4: [null, Validators.required],
      q5: [''],
    });
  }

  ngOnInit(): void {
    const userId = this.auth.getCurrentUser()?.userId;
    if (!userId) return;
    this.scoreSvc.getTraineeScores(userId).subscribe({
      next: d => { this.scores = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  selectScore(id: number): void {
    this.selectedScoreId = id;
    this.feedbackForm.reset();
  }

  get selectedScore(): ScoreResponse | undefined {
    return this.scores.find(s => s.id === this.selectedScoreId);
  }

  submitFeedback(): void {
    if (this.feedbackForm.invalid || !this.selectedScoreId) return;
    this.submitting = true;
    const v = this.feedbackForm.value;
    const msg = `Trainer Feedback:\n` +
      `Q1 (Concept Explanation): ${v.q1}/5\n` +
      `Q2 (Study Material): ${v.q2}/5\n` +
      `Q3 (Practice Sessions): ${v.q3}/5\n` +
      `Q4 (Approachability): ${v.q4}/5\n` +
      (v.q5 ? `Comments: ${v.q5}` : '');

    this.feedbackSvc.addMessage(this.selectedScoreId, msg).subscribe({
      next: () => {
        this.submitting = false;
        this.submittedFeedbacks.push(this.selectedScoreId!);
        this.selectedScoreId = null;
        this.snack.open('Feedback submitted!', 'Close', { duration: 3000 });
      },
      error: err => { this.submitting = false; this.snack.open(err.error?.error ?? 'Failed', 'Close', { duration: 3000 }); }
    });
  }

  ratings = [1, 2, 3, 4, 5];
  alreadySubmitted(id: number): boolean { return this.submittedFeedbacks.includes(id); }
}
