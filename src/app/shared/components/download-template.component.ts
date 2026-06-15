import { Component } from '@angular/core';
import { TemplateService } from '../../core/services/api.services';

@Component({
  selector: 'app-download-template',
  template: `<button mat-raised-button color="primary" (click)="downloadTemplate()">Download Excel Template</button>`
})
export class DownloadTemplateComponent {
  constructor(private templateService: TemplateService) {}
  downloadTemplate() {
    this.templateService.downloadScoreTemplate().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'score-upload-template.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
