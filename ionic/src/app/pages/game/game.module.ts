import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';
import { ComponentModule } from 'src/app/components/component.module';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { ActorProfileComponent } from 'src/app/components/modals/actor-profile/actor-profile.component';
import { TranslateModule } from '@ngx-translate/core';

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
    ActorProfileComponent
  ]
})
export class GamePageModule {}
