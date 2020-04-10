import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ComponentModule } from 'src/app/components/component.module';
import { NewBookComponent } from 'src/app/components/modals/new-book/new-book.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentModule
  ],
  declarations: [HomePage],
  entryComponents: [NewBookComponent]
})
export class HomePageModule {}
