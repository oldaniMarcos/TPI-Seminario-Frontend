import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { HomeComponent } from './components/home/home.component';
import { NewVisitComponent } from './components/new-visit/new-visit.component';
import { CashflowManagementComponent } from './components/cashflow-management/cashflow-management.component';
import { ManageComponent } from './components/manage/manage.component';
import { InstallmentsComponent } from './components/installments/installments.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'home', component: HomeComponent },

  { path: 'new-visit', component: NewVisitComponent },

  { path: 'cashflow-management', component: CashflowManagementComponent },

  { path: 'manage', component: ManageComponent },

  { path: 'installments', component: InstallmentsComponent },

  { path: 'reports', component: ReportsComponent },

  // Errors

  { path: 'page-not-found', component: PageNotFoundComponent },

  { path: 'not-authorized', component: NotAuthorizedComponent },

  // Wildcard route
  { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },

];
