import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsBookPage } from './settings-book.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsBookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsBookPageRoutingModule {}
