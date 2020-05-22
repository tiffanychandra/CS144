import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { CanDeactivateGuard } from './can-deactivate.guard';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditComponent,
    canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [CanDeactivateGuard],
})
export class AppRoutingModule {}
