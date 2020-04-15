import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoverPageRoutingModule } from './cover-routing.module';

import { CoverPage } from './cover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoverPageRoutingModule
  ],
  declarations: [CoverPage]
})
export class CoverPageModule {}
