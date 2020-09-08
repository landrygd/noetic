import { VariablesViewerComponent } from './../../components/modals/variables-viewer/variables-viewer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';
import { ComponentModule } from 'src/app/components/component.module';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { TranslateModule } from '@ngx-translate/core';
import { EntityModalComponent } from 'src/app/components/modals/entity-modal/entity-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule,
    ComponentModule,
    TranslateModule
  ],
  declarations: [GamePage],
  entryComponents: [
    UploadComponent,
    EntityModalComponent,
    VariablesViewerComponent
  ]
})
export class GamePageModule {}
