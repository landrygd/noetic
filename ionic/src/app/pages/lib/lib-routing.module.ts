import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibPage } from './lib.page';

const routes: Routes = [
  {
    path: '',
    component: LibPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibPageRoutingModule {}
