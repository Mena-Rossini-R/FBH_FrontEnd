import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-student-progress',
  template: `
    <div *ngIf="student">
      <h3>{{ student.name }}'s Progress</h3>
      <div>Average Score: {{ student.avg }}%</div>
      <div>Trend: {{ student.trend }}</div>
      <!-- TODO: Add more detailed progress info -->
    </div>
    <div *ngIf="!student">Select a student to view progress.</div>
  `
})
export class StudentProgressComponent {
  @Input() student: any;
}
