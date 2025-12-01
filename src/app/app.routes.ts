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
import { ClientsComponent } from './components/clients/clients.component';
import { SpeciesBreedsComponent } from './components/species-breeds/species-breeds.component';
import { SupplyTypesComponent } from './components/supply-types/supply-types.component';
import { VetsComponent } from './components/vets/vets.component';
import { WithdrawalsComponent } from './components/withdrawals/withdrawals.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  { path: 'new-visit', component: NewVisitComponent, canActivate: [AuthGuard] },

  { path: 'cashflow-management', component: CashflowManagementComponent, canActivate: [AuthGuard] },

  { path: 'manage', component: ManageComponent, canActivate: [AuthGuard] },

  { path: 'installments', component: InstallmentsComponent, canActivate: [AuthGuard] },

  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },

  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },

  { path: 'species-breeds', component: SpeciesBreedsComponent, canActivate: [AuthGuard] },

  { path: 'supply-types', component: SupplyTypesComponent, canActivate: [AuthGuard] },

  { path: 'vets', component: VetsComponent, canActivate: [AuthGuard] },

  { path: 'withdrawals', component: WithdrawalsComponent, canActivate: [AuthGuard] },

  // Errors

  { path: 'page-not-found', component: PageNotFoundComponent },

  { path: 'not-authorized', component: NotAuthorizedComponent },

  // Wildcard route
  { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },

];
