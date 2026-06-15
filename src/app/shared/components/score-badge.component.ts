// src/app/shared/components/score-badge.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-badge',
  template: `
    <span class="badge" [style.background]="getBg()" [style.color]="getColor()">
      {{ label }}
    </span>`,
  styles: [`
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }
  `]
})
export class ScoreBadgeComponent {
  @Input() label = '';
  @Input() color: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'teal' = 'blue';

  private map: Record<string, { bg: string; text: string }> = {
    green:  { bg: '#E8F5E9', text: '#1A8240' },
    amber:  { bg: '#FFF3E0', text: '#BE780E' },
    red:    { bg: '#FFEBEE', text: '#C22626' },
    blue:   { bg: '#EAF2FE', text: '#2A70B2' },
    purple: { bg: '#F3E5F5', text: '#6838A8' },
    teal:   { bg: '#E0F2F1', text: '#12987A' },
  };

  getBg():    string { return this.map[this.color]?.bg    ?? '#EAF2FE'; }
  getColor(): string { return this.map[this.color]?.text  ?? '#2A70B2'; }
}
