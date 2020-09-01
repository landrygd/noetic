import { ComponentModule } from 'src/app/components/component.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActorsPageRoutingModule } from './actors-routing.module';

import { ActorsPage } from './actors.page';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { EntityModalComponent } from 'src/app/components/modals/entity-modal/entity-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { IdFinderComponent } from 'src/app/components/modals/id-finder/id-finder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActorsPageRoutingModule,
    ComponentModule,
    TranslateModule
  ],
  declarations: [ActorsPage],
  entryComponents: [EntityModalComponent, UploadComponent, IdFinderComponent]
})
export class ActorsPageModule {}
