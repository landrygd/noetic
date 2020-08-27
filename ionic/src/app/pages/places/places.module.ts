import { TranslateService } from '@ngx-translate/core';
import { ModalModule } from './../../components/modals/modal.module';
import { ComponentModule } from 'src/app/components/component.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacesPageRoutingModule } from './places-routing.module';

import { PlacesPage } from './places.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacesPageRoutingModule,
    ComponentModule
  ],
  declarations: [PlacesPage]
})
export class PlacesPageModule {}
