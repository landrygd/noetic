import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsBookPageRoutingModule } from './settings-book-routing.module';

import { SettingsBookPage } from './settings-book.page';
import { ComponentModule } from 'src/app/components/component.module';
import { SearchUserComponent } from 'src/app/components/modals/search-user/search-user.component';
import { WallpapersSearchComponent } from 'src/app/components/modals/wallpapers-search/wallpapers-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsBookPageRoutingModule,
    ComponentModule
  ],
  declarations: [SettingsBookPage],
  entryComponents: [SearchUserComponent, WallpapersSearchComponent]
})
export class SettingsBookPageModule {}
