import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout.component';
import { LoginComponent } from './features/auth/login.component';
import { TrainerDashboardComponent } from './features/trainer/dashboard/trainer-dashboard.component';
import { StudentDirectoryComponent } from './features/trainer/directory/student-directory.component';
import { PodManagerComponent } from './features/trainer/pods/pod-manager.component';
import { BulkUploadComponent } from './features/trainer/upload/bulk-upload.component';
import { ConsolidatedReportComponent } from './features/trainer/agent/consolidated-report.component';
import { ActivityLogComponent } from './features/trainer/activity/activity-log.component';
import { TrainerFeedbackViewComponent } from './features/trainer/feedback/trainer-feedback-view.component';
import { TraineeDashboardComponent } from './features/trainee/dashboard/trainee-dashboard.component';
import { ScorecardsComponent } from './features/trainee/scorecards/scorecards.component';
import { FeedbackThreadComponent } from './features/trainee/feedback/feedback-thread.component';
import { SkillAlertsComponent } from './features/trainee/alerts/skill-alerts.component';
import { CohortInfoComponent } from './features/trainee/cohort/cohort-info.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: MainLayoutComponent, canActivate: [AuthGuard],
    children: [
      // Trainer
      { path: 'trainer/dashboard',  component: TrainerDashboardComponent },
      { path: 'trainer/students',   component: StudentDirectoryComponent },
      { path: 'trainer/pods',       component: PodManagerComponent },
      { path: 'trainer/upload',     component: BulkUploadComponent },
      { path: 'trainer/activity',   component: ActivityLogComponent },
      { path: 'trainer/feedback',   component: TrainerFeedbackViewComponent },
      { path: 'trainer/agent',     component: ConsolidatedReportComponent },
      // Trainee
      { path: 'trainee/dashboard',          component: TraineeDashboardComponent },
      { path: 'trainee/scorecards',         component: ScorecardsComponent },
      { path: 'trainee/feedback',           component: FeedbackThreadComponent },
      { path: 'trainee/alerts',             component: SkillAlertsComponent },
      { path: 'trainee/cohort',             component: CohortInfoComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
