import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsBookPageRoutingModule } from './settings-book-routing.module';

import { SettingsBookPage } from './settings-book.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsBookPageRoutingModule
  ],
  declarations: [SettingsBookPage]
})
export class SettingsBookPageModule {}
