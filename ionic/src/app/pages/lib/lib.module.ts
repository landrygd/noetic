import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibPageRoutingModule } from './lib-routing.module';

import { LibPage } from './lib.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibPageRoutingModule,
    ComponentModule
  ],
  declarations: [LibPage]
})
export class LibPageModule {}
