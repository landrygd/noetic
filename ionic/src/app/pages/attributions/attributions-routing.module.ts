import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttributionsPage } from './attributions.page';

const routes: Routes = [
  {
    path: '',
    component: AttributionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttributionsPageRoutingModule {}
