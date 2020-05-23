import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'preview/:id',
    component: PreviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [CanDeactivateGuard],
})
export class AppRoutingModule {}
