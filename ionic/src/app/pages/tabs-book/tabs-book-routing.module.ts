import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsBookPage } from './tabs-book.page';

const routes: Routes = [
  {
    path: '',
    component: TabsBookPage,
    children: [
      {
        path: 'story',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../story/story.module').then(m => m.StoryPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'story',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'story',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsBookPageRoutingModule {}
