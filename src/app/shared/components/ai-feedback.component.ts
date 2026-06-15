import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ai-feedback',
  template: `
    <div *ngIf="feedback; else loading">
      <mat-icon color="accent">smart_toy</mat-icon>
      <span>{{ feedback }}</span>
    </div>
    <ng-template #loading>
      <mat-progress-spinner diameter="20" mode="indeterminate"></mat-progress-spinner>
      <span>Loading AI feedback...</span>
    </ng-template>
  `
})
export class AiFeedbackComponent {
  @Input() feedback: string | null | undefined = null;
}
