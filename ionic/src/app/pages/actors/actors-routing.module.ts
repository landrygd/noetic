import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActorsPage } from './actors.page';

const routes: Routes = [
  {
    path: '',
    component: ActorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActorsPageRoutingModule {}
