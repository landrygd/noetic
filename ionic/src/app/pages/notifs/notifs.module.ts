import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotifsPageRoutingModule } from './notifs-routing.module';

import { NotifsPage } from './notifs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotifsPageRoutingModule
  ],
  declarations: [NotifsPage]
})
export class NotifsPageModule {}
