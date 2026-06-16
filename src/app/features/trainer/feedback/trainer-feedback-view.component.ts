import { Component, OnInit } from '@angular/core';
import { FeedbackService, ScoreService } from '../../../core/services/api.services';
import { ScoreResponse, FeedbackResponse } from '../../../shared/models';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface StudentGroup {
  name: string;
  email: string;
  scores: ScoreResponse[];
  totalUnread: number;
}

@Component({
  selector: 'app-trainer-feedback-view',
  templateUrl: './trainer-feedback-view.component.html',
  styleUrls: ['./trainer-feedback-view.component.scss']
})
export class TrainerFeedbackViewComponent implements OnInit {
  students: StudentGroup[] = [];
  selectedStudent: StudentGroup | null = null;
  selectedScore: ScoreResponse | null = null;
  messages: FeedbackResponse[] = [];
  messageCtrl = new FormControl('', Validators.required);
  loading = false;
  loadingMessages = false;
  sending = false;

  private unreadScoreIds = new Set<number>();

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
        const relevant = scores.filter(s =>
          s.feedbackStatus === 'PENDING' || s.feedbackStatus === 'VIEWED' || s.feedbackStatus === 'ACKNOWLEDGED'
        );
        const map = new Map<string, StudentGroup>();
        for (const s of relevant) {
          if (!map.has(s.traineeEmail)) {
            map.set(s.traineeEmail, { name: s.traineeName, email: s.traineeEmail, scores: [], totalUnread: 0 });
          }
          const group = map.get(s.traineeEmail)!;
          group.scores.push(s);
          if (s.feedbackStatus === 'PENDING') group.totalUnread++;
        }
        this.students = Array.from(map.values());
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Failed to load feedback', 'Close', { duration: 3000 });
      }
    });
  }

  selectStudent(s: StudentGroup): void {
    this.selectedStudent = s;
    this.selectedScore = null;
    this.messages = [];
    this.unreadScoreIds = new Set(s.scores.filter(sc => sc.feedbackStatus === 'PENDING').map(sc => sc.id));
  }

  selectScore(score: ScoreResponse): void {
    this.selectedScore = score;
    this.loadingMessages = true;
    this.feedbackSvc.getThread(score.id).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        this.unreadScoreIds.delete(score.id);
        if (this.selectedStudent) {
          this.selectedStudent.totalUnread = this.unreadScoreIds.size;
        }
        this.loadingMessages = false;
      },
      error: () => {
        this.loadingMessages = false;
        this.snack.open('Failed to load conversation', 'Close', { duration: 3000 });
      }
    });
  }

  hasUnread(scoreId: number): boolean {
    return this.unreadScoreIds.has(scoreId);
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