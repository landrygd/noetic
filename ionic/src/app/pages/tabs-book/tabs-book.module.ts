import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsBookPageRoutingModule } from './tabs-book-routing.module';

import { TabsBookPage } from './tabs-book.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsBookPageRoutingModule
  ],
  declarations: [TabsBookPage]
})
export class TabsBookPageModule {}
