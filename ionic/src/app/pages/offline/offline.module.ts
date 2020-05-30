import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflinePageRoutingModule } from './offline-routing.module';

import { OfflinePage } from './offline.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflinePageRoutingModule,
    TranslateModule
  ],
  declarations: [OfflinePage]
})
export class OfflinePageModule {}
