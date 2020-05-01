import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookEndPage } from './book-end.page';

const routes: Routes = [
  {
    path: '',
    component: BookEndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookEndPageRoutingModule {}
