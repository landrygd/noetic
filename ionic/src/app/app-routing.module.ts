import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { BookEditorGuard } from './guards/book-editor.guard';
import { NetworkGuard } from './guards/network.guard';

const routes: Routes = [
  {path: '', canActivate: [NetworkGuard], children: [
    {
      path: '',
      loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {
      path: 'tabs-book',
      canActivate: [BookEditorGuard],
      loadChildren: () => import('./pages/tabs-book/tabs-book.module').then( m => m.TabsBookPageModule)
    },
    {
      path: 'home',
      loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
    },
    {
      path: 'login',
      loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
    },
    {
      path: 'game',
      canActivate: [BookEditorGuard],
      loadChildren: () => import('./pages/game/game.module').then( m => m.GamePageModule)
    },
    {
      path: 'user/:id',
      loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
    },
    {
      path: 'register',
      loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
    },
    {
      path: 'book/:id',
      loadChildren: () => import('./pages/cover/cover.module').then( m => m.CoverPageModule)
    },
    {
      path: 'chat',
      canActivate: [BookEditorGuard],
      loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
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
      canActivate: [AuthGuard],
      loadChildren: () => import('./pages/notifs/notifs.module').then( m => m.NotifsPageModule)
    },
    {
      path: 'book-search',
      loadChildren: () => import('./pages/book-search/book-search.module').then( m => m.BookSearchPageModule)
    },
    {
      path: 'user-settings',
      canActivate: [AuthGuard],
      loadChildren: () => import('./pages/user-settings/user-settings.module').then( m => m.UserSettingsPageModule)
    },
    {
      path: 'settings-book',
      canActivate: [BookEditorGuard],
      loadChildren: () => import('./pages/settings-book/settings-book.module').then( m => m.SettingsBookPageModule)
    },
    {
      path: 'forgot-password',
      loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
    },
    {
      path: 'offline',
      loadChildren: () => import('./pages/offline/offline.module').then( m => m.OfflinePageModule)
    }
  ]},
  {
    path: 'privacy',
    loadChildren: () => import('./pages/privacy/privacy.module').then( m => m.PrivacyPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
