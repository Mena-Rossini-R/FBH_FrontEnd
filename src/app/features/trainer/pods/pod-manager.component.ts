import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../../../core/services/api.services';
import { ScoreResponse, UserProfile } from '../../../shared/models';

@Component({
  selector: 'app-pod-manager',
  templateUrl: './pod-manager.component.html',
  styleUrls: ['./pod-manager.component.scss']
})
export class PodManagerComponent implements OnInit {
  loading = true;
  scores:   ScoreResponse[] = [];
  trainees: UserProfile[]   = [];

  pods: any[]    = [];
  cohorts: any[] = [];

  selectedPod: string | null    = null;
  selectedStudent: any | null   = null;
  viewMode: 'pods' | 'students' = 'pods';

  constructor(private scoreSvc: ScoreService) {}

  ngOnInit(): void {
    this.scoreSvc.getTrainerScores().subscribe({
      next: scores => {
        this.scores = scores;
        this.buildPods(scores);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  buildPods(scores: ScoreResponse[]): void {
    const podMap: Record<string, ScoreResponse[]> = {};
    const cohortMap: Record<string, ScoreResponse[]> = {};

    for (const s of scores) {
      if (s.podName) {
        if (!podMap[s.podName]) podMap[s.podName] = [];
        podMap[s.podName].push(s);
      }
    }

    const colors = ['#2A70B2','#1A8240','#BE780E','#C22626','#12987A','#6838A8'];
    this.pods = Object.entries(podMap).map(([name, sc], i) => {
      const studentMap: Record<string, ScoreResponse[]> = {};
      for (const s of sc) {
        if (!studentMap[s.traineeName]) studentMap[s.traineeName] = [];
        studentMap[s.traineeName].push(s);
      }
      const students = Object.entries(studentMap).map(([sName, sScores]) => {
        const avg = sScores.reduce((a,b) => a + b.score, 0) / sScores.length;
        const byCategory: Record<string, number[]> = {};
        for (const sc2 of sScores) {
          if (!byCategory[sc2.category]) byCategory[sc2.category] = [];
          byCategory[sc2.category].push(sc2.score);
        }
        const catAvgs: Record<string, number> = {};
        for (const [cat, vals] of Object.entries(byCategory)) {
          catAvgs[cat] = Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
        }
        const sorted = [...sScores].sort((a,b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime());
        const trend = sorted.length >= 2
          ? (sorted[sorted.length-1].score > sorted[0].score ? 'UP' : sorted[sorted.length-1].score < sorted[0].score ? 'DOWN' : 'STABLE')
          : 'STABLE';
        return { name: sName, email: sScores[0].traineeEmail, avg: Math.round(avg),
                 scores: sScores, catAvgs, trend, count: sScores.length };
      });
      const avg = sc.reduce((a,b) => a + b.score, 0) / sc.length;
      return { name, avg: Math.round(avg), count: students.length, color: colors[i%colors.length],
               status: avg>=75?'Active':avg>=65?'At Risk':'Critical', students };
    });
  }

  selectPod(pod: any): void { this.selectedPod = pod.name; this.selectedStudent = null; }
  selectStudent(s: any): void { this.selectedStudent = s; }
  back(): void {
    if (this.selectedStudent) this.selectedStudent = null;
    else if (this.selectedPod) this.selectedPod = null;
  }

  get currentPod(): any { return this.pods.find(p => p.name === this.selectedPod); }
  get weakCategories(): string[] {
    if (!this.selectedStudent) return [];
    return Object.entries(this.selectedStudent.catAvgs)
      .filter(([, v]) => (v as number) < 70)
      .map(([k]) => k);
  }

  getScoreColor(s: number): string { return s>=75?'#059669':s>=65?'#D97706':'#DC2626'; }
  getTrendIcon(t: string): string  { return t==='UP'?'trending_up':t==='DOWN'?'trending_down':'trending_flat'; }
  getTrendColor(t: string): string { return t==='UP'?'#059669':t==='DOWN'?'#DC2626':'#94A3B8'; }

  firstName(name: string): string {
    return name ? name.split(' ')[0] : '';
  }

  getStudentName(s: any): string {
    return typeof s === 'object' && s && typeof s.name === 'string' ? s.name : '';
  }

  catEntries(catAvgs: Record<string, number>): { key: string; value: number }[] {
    if (!catAvgs) return [];
    return Object.entries(catAvgs).map(([key, value]) => ({ key, value: Number(value) }));
  }

  catBg(value: number): string {
    return value >= 75 ? '#DCFCE7' : value >= 65 ? '#FEF3C7' : '#FEE2E2';
  }

  catColor(value: number): string {
    return value >= 75 ? '#059669' : value >= 65 ? '#D97706' : '#DC2626';
  }

  getCatScore(cat: string): number {
    if (!this.selectedStudent) return 0;
    return this.selectedStudent.catAvgs[cat] ?? 0;
  }

}