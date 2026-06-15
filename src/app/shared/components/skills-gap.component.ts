import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skills-gap',
  template: `
    <h3>Skills Gap Analysis</h3>
    <div *ngIf="analysis; else loading">{{ analysis }}</div>
    <ng-template #loading>AI analysis coming soon...</ng-template>
  `
})
export class SkillsGapComponent {
  @Input() analysis: string | null | undefined = null;
}
