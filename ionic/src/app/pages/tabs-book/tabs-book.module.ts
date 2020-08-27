import { ComponentModule } from 'src/app/components/component.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsBookPageRoutingModule } from './tabs-book-routing.module';

import { TabsBookPage } from './tabs-book.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsBookPageRoutingModule,
    ComponentModule,
    TranslateModule
  ],
  declarations: [TabsBookPage]
})
export class TabsBookPageModule {}
