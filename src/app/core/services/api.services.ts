import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScoreResponse, ScoreRequest, BulkUploadResult, CohortUploadResult,
         FeedbackResponse, AlertResponse, DashboardStats, UserProfile } from '../../shared/models';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ScoreService {
  constructor(private http: HttpClient) {}
  createScore(req: ScoreRequest): Observable<ScoreResponse>             { return this.http.post<ScoreResponse>(`${API}/scores`, req); }
  getTraineeScores(id: number): Observable<ScoreResponse[]>             { return this.http.get<ScoreResponse[]>(`${API}/scores/trainee/${id}`); }
  getTrainerScores(): Observable<ScoreResponse[]>                        { return this.http.get<ScoreResponse[]>(`${API}/scores/trainer`); }
  getAllScores(): Observable<ScoreResponse[]>                             { return this.http.get<ScoreResponse[]>(`${API}/scores/all`); }
  bulkUpload(file: File): Observable<BulkUploadResult> {
    const fd = new FormData(); fd.append('file', file);
    return this.http.post<BulkUploadResult>(`${API}/scores/bulk-upload`, fd);
  }
  getAiFeedback(scoreId: number): Observable<{feedback: string}>         { return this.http.get<{feedback:string}>(`${API}/scores/${scoreId}/ai-feedback`); }
  getSkillsGap(traineeId: number): Observable<{analysis: string}>        { return this.http.get<{analysis:string}>(`${API}/scores/trainee/${traineeId}/skills-gap`); }
  getConsolidatedReport(): Observable<any>                               { return this.http.get<any>(`${API}/trainer/agent/consolidated-report`); }
  getScoresByTrainee(id: number): Observable<ScoreResponse[]> {
    return this.getTraineeScores(id);
  }
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private http: HttpClient) {}
  addMessage(scoreId: number, message: string): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${API}/feedback`, { scoreId, message });
  }
  getThread(scoreId: number): Observable<FeedbackResponse[]>             { return this.http.get<FeedbackResponse[]>(`${API}/feedback/score/${scoreId}`); }
  markViewed(scoreId: number): Observable<void>                          { return this.http.post<void>(`${API}/feedback/score/${scoreId}`, {}); }
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private http: HttpClient) {}
  getAlerts(userId: number): Observable<AlertResponse[]>                 { return this.http.get<AlertResponse[]>(`${API}/alerts/${userId}`); }
  acknowledge(id: number): Observable<AlertResponse>                     { return this.http.post<AlertResponse>(`${API}/alerts/${id}/acknowledge`, {}); }
  resolve(id: number): Observable<AlertResponse>                         { return this.http.post<AlertResponse>(`${API}/alerts/${id}/resolve`, {}); }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}
  getTrainerDashboard(): Observable<DashboardStats>                      { return this.http.get<DashboardStats>(`${API}/trainer/dashboard`); }
  getTraineeDashboard(id: number): Observable<DashboardStats>            { return this.http.get<DashboardStats>(`${API}/trainee/dashboard`); }
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  constructor(private http: HttpClient) {}
  downloadScoreTemplate(): Observable<Blob> {
    return this.http.get(`${API}/template/score-upload`, { responseType: 'blob' });
  }
  downloadCohortTemplate(): Observable<Blob> {
  return this.http.get(`${API}/template/cohort-upload`, { responseType: 'blob' });
}
}

@Injectable({ providedIn: 'root' })
export class AiService {
  constructor(private http: HttpClient) {}
  getAiFeedback(scoreId: number): Observable<string> {
    return this.http.get(`${API}/ai/feedback/${scoreId}`, { responseType: 'text' });
  }
  getSkillsGap(traineeId: number): Observable<string> {
    return this.http.get(`${API}/ai/skills-gap/${traineeId}`, { responseType: 'text' });
  }
}

@Injectable({ providedIn: 'root' })
export class TrainerFeedbackService {
  constructor(private http: HttpClient) {}
  submitTrainerFeedback(feedback: string): Observable<string> {
    return this.http.post(`${API}/feedback/trainer`, feedback, { responseType: 'text' });
  }
}

@Injectable({ providedIn: 'root' })
export class CohortUploadService {
  constructor(private http: HttpClient) {}
  uploadCohort(file: File): Observable<CohortUploadResult> {
  const fd = new FormData(); fd.append('file', file);
  return this.http.post<CohortUploadResult>(`${API}/cohort/upload`, fd);
  }
}
