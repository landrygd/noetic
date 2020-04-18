import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotifsPage } from './notifs.page';

const routes: Routes = [
  {
    path: '',
    component: NotifsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotifsPageRoutingModule {}
