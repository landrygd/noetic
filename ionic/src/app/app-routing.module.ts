import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tabs-book',
    loadChildren: () => import('./pages/tabs-book/tabs-book.module').then( m => m.TabsBookPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'story',
    loadChildren: () => import('./pages/story/story.module').then( m => m.StoryPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'settings-book',
    loadChildren: () => import('./pages/settings-book/settings-book.module').then( m => m.SettingsBookPageModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./pages/game/game.module').then( m => m.GamePageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'cover',
    loadChildren: () => import('./pages/cover/cover.module').then( m => m.CoverPageModule)
  },
  {
    path: 'new-book',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/new-book/new-book.module').then( m => m.NewBookPageModule)
  },
  {
    path: 'attributions',
    loadChildren: () => import('./pages/attributions/attributions.module').then( m => m.AttributionsPageModule)
  },
  {
    path: 'presentation',
    loadChildren: () => import('./pages/presentation/presentation.module').then( m => m.PresentationPageModule)
  },
  {
    path: 'notifs',
    loadChildren: () => import('./pages/notifs/notifs.module').then( m => m.NotifsPageModule)
  },
  {
    path: 'book-search',
    loadChildren: () => import('./pages/book-search/book-search.module').then( m => m.BookSearchPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
