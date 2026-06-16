import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skills-gap',
  template: `
    <div *ngIf="analysis != null && analysis !== ''; else noData">
      <h3>Skills Gap Analysis</h3>
      <div>{{ analysis }}</div>
    </div>
    <ng-template #noData>
      <span style="color:#9BA8BB; font-size:12px;">No skills gap analysis available</span>
    </ng-template>
  `
})
export class SkillsGapComponent {
  @Input() analysis: string | null | undefined = null;
}