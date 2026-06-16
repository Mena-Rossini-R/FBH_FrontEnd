export type UserRole = 'TRAINER' | 'TRAINEE';
export type AlertLevel = 'CRITICAL' | 'WARNING' | 'WATCH';
export type FeedbackStatus = 'PENDING' | 'VIEWED' | 'ACKNOWLEDGED';
export type TrendDirection = 'UP' | 'DOWN' | 'STABLE';

export interface AuthResponse {
  token: string; role: UserRole; fullName: string; userId: number;
  email: string; podName?: string; cohortName?: string;
}
export interface LoginRequest { email: string; password: string; }

export interface ScoreResponse {
  id: number; traineeName: string; traineeEmail: string; podName: string;
  trainerName: string; assignmentName: string; category: string; score: number;
  grade: string; submittedDate: string; feedbackStatus: FeedbackStatus;
  trend: TrendDirection; weekLabel: string; createdAt: string; aiFeedback?: string;
}

export interface ScoreRequest {
  traineeId: number; assignmentName: string; category: string; score: number;
  grade?: string; submittedDate?: string; weekLabel?: string;
}

export interface BulkUploadResult {
  uploaded: ScoreResponse[]; errors: string[];
  successCount: number; errorCount: number;
}

export interface CohortUploadResult {
  created: UserProfile[]; updated: UserProfile[];
  errors: string[]; createdCount: number; updatedCount: number; errorCount: number;
}

export interface FeedbackResponse {
  id: number; scoreId: number; assignmentName: string; senderName: string;
  senderRole: string; message: string; readByTrainee: boolean; readByTrainer: boolean; createdAt: string;
}

export interface AlertResponse {
  id: number; skillName: string; scoreValue: number; alertLevel: AlertLevel;
  message: string; acknowledged: boolean; resolved: boolean;
  createdAt: string; acknowledgedAt?: string;
}

export interface DashboardStats {
  totalStudents?: number; avgScore?: number; belowThreshold?: number; activePods?: number;
  podAverages?: Record<string, number>; atRiskStudents?: UserProfile[];
  overallProgress?: number; assignmentsDone?: number; totalAssignments?: number;
  pendingFeedback?: number; weeklyTrend?: Record<string, number>;
  recentActivity?: ActivityLog[]; recentScores?: ScoreResponse[];
  aiFeedback?: string; skillsGap?: string;
}

export interface ActivityLog {
  id: number; activityType: string; description: string;
  performedBy: string; targetEntity: string; createdAt: string;
}

export interface UserProfile {
  id: number; fullName: string; email: string; role?: string;
  podName?: string; cohortName?: string; latestScore?: number; trendDirection?: string;
  aiFeedback?: string; skillsGap?: string;
}

export interface StudentProgress {
  trainee: UserProfile; scores: ScoreResponse[];
  avgScore: number; trend: TrendDirection; categories: Record<string, number>;
  skillsGap?: string; aiFeedback?: string;
}

export interface CohortStudentInfo {
  id: number; fullName: string; email: string; phone?: string; department?: string;
}
export interface CohortPodInfo {
  podName: string; students: CohortStudentInfo[];
}
export interface CohortInfo {
  cohortName: string; pods: CohortPodInfo[]; studentCount: number;
}
export interface CohortStructure {
  cohorts: CohortInfo[]; unassigned: CohortStudentInfo[];
}

// ── AI Agent ──────────────────────────────────────────────────────────────
export interface TraineeSummary {
  name: string; email: string; podName: string; average: number;
  status: 'STRONG' | 'GOOD' | 'WATCH' | 'AT_RISK';
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  weakestCategory: string; assessmentCount: number; recommendation: string;
}
export interface CategoryInsight {
  category: string; classAverage: number; studentsBelowThreshold: number;
  healthIcon: string; suggestion: string;
}
export interface ConsolidatedReport {
  trainerName: string; totalTrainees: number; totalAssessments: number;
  classAverage: number; classHealthStatus: string; executiveSummary: string;
  traineeSummaries: TraineeSummary[]; topPerformers: string[];
  atRiskTrainees: string[]; categoryInsights: CategoryInsight[];
  trainerActions: string[]; confidenceScore: number;
}
