import { Component } from '@angular/core';

@Component({
  selector: 'app-trainer-feedback',
  template: `
    <h3>Trainer Feedback</h3>
    <form>
      <!-- TODO: Replace with real questions from tecstac portal -->
      <mat-form-field appearance="fill">
        <mat-label>How helpful was your trainer?</mat-label>
        <mat-select>
          <mat-option value="1">Not helpful</mat-option>
          <mat-option value="2">Somewhat helpful</mat-option>
          <mat-option value="3">Very helpful</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Comments</mat-label>
        <textarea matInput></textarea>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit">Submit</button>
    </form>
  `
})
export class TrainerFeedbackComponent {}
