import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ai-feedback',
  template: `
    <div *ngIf="feedback != null && feedback !== ''; else noData">
      <mat-icon color="accent">smart_toy</mat-icon>
      <span>{{ feedback }}</span>
    </div>
    <ng-template #noData>
      <span style="color:#9BA8BB; font-size:12px;">No AI feedback available</span>
    </ng-template>
  `
})
export class AiFeedbackComponent {
  @Input() feedback: string | null | undefined = null;
}