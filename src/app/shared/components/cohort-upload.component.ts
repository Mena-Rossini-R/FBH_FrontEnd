import { Component } from '@angular/core';
import { CohortUploadService } from '../../core/services/api.services';
import { CohortUploadResult } from '../models';

@Component({
  selector: 'app-cohort-upload',
  template: `
    <h3>Upload Cohort/Pod Excel</h3>
    <input type="file" (change)="onFileChange($event)" accept=".xlsx,.xls" />
    <button mat-raised-button color="primary" (click)="upload()" [disabled]="!file">Upload</button>
    <div *ngIf="result">
  {{ result.createdCount }} created, {{ result.updatedCount }} updated, {{ result.errorCount }} errors
</div>
  `
})
export class CohortUploadComponent {
  file: File | null = null;
  result: CohortUploadResult | null = null;

  constructor(private cohortUploadService: CohortUploadService) {}

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  upload() {
    if (!this.file) return;
    this.cohortUploadService.uploadCohort(this.file).subscribe(res => {
      this.result = res;
    }, err => {
      this.result = null;
    });
  }
}
