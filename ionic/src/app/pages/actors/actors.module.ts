import { ActorProfileComponent } from 'src/app/components/modals/actor-profile/actor-profile.component';
import { ComponentModule } from 'src/app/components/component.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActorsPageRoutingModule } from './actors-routing.module';

import { ActorsPage } from './actors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActorsPageRoutingModule,
    ComponentModule
  ],
  declarations: [ActorsPage],
  entryComponents: [ActorProfileComponent]
})
export class ActorsPageModule {}
