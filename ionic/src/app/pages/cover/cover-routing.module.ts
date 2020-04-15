import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoverPage } from './cover.page';

const routes: Routes = [
  {
    path: '',
    component: CoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoverPageRoutingModule {}
