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
import { BreedsComponent } from './components/species-breeds/breeds/breeds.component';
import { PricesComponent } from './components/supply-types/prices/prices.component';
import { LotsComponent } from './components/supply-types/lots/lots.component';
import { PetsComponent } from './components/clients/pets/pets.component';
import { PastDueClientsComponent } from './components/past-due-clients/past-due-clients.component';
import { BalanceComponent } from './components/balance/balance.component';
import { BalanceMonthlyComponent } from './components/balance-monthly/balance-monthly.component';

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

  { path: 'client/:id/pets', component: PetsComponent, canActivate: [AuthGuard] },

  { path: 'species-breeds', component: SpeciesBreedsComponent, canActivate: [AuthGuard] },

  { path: 'species/:id/breeds', component: BreedsComponent, canActivate: [AuthGuard] },

  { path: 'supply-types', component: SupplyTypesComponent, canActivate: [AuthGuard] },

  { path: 'types/:id/prices', component: PricesComponent, canActivate: [AuthGuard] },

  { path: 'types/:id/lots', component: LotsComponent, canActivate: [AuthGuard] },

  { path: 'vets', component: VetsComponent, canActivate: [AuthGuard] },

  { path: 'withdrawals', component: WithdrawalsComponent, canActivate: [AuthGuard] },

  { path: 'past-due-clients', component: PastDueClientsComponent, canActivate: [AuthGuard] },

  { path: 'balance', component: BalanceComponent, canActivate: [AuthGuard] },

  { path: 'balance-monthly', component: BalanceMonthlyComponent, canActivate: [AuthGuard] },

  // Errors

  { path: 'page-not-found', component: PageNotFoundComponent },

  { path: 'not-authorized', component: NotAuthorizedComponent },

  // Wildcard route
  { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },

];
