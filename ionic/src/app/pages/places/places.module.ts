import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ModalModule } from './../../components/modals/modal.module';
import { ComponentModule } from 'src/app/components/component.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacesPageRoutingModule } from './places-routing.module';

import { PlacesPage } from './places.page';
import { EntityModalComponent } from 'src/app/components/modals/entity-modal/entity-modal.component';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacesPageRoutingModule,
    ComponentModule,
    TranslateModule
  ],
  declarations: [PlacesPage],
  entryComponents: [EntityModalComponent, UploadComponent]
})
export class PlacesPageModule {}
