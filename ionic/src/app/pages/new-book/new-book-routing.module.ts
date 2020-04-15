import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewBookPage } from './new-book.page';

const routes: Routes = [
  {
    path: '',
    component: NewBookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewBookPageRoutingModule {}
