import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContainerComponent } from './dashboard/dashboard-container/dashboard-container.component';

const routes: Routes = [
  { path: 'assets', component: DashboardContainerComponent },
  { path: '**', redirectTo: 'assets' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
