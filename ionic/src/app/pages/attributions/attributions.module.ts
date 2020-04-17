import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttributionsPageRoutingModule } from './attributions-routing.module';

import { AttributionsPage } from './attributions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttributionsPageRoutingModule
  ],
  declarations: [AttributionsPage]
})
export class AttributionsPageModule {}
