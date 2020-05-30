import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotifsPageRoutingModule } from './notifs-routing.module';

import { NotifsPage } from './notifs.page';
import { ComponentModule } from 'src/app/components/component.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotifsPageRoutingModule,
    ComponentModule,
    TranslateModule
  ],
  declarations: [NotifsPage]
})
export class NotifsPageModule {}
