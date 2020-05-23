import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ComponentModule } from 'src/app/components/component.module';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { ActorProfileComponent } from 'src/app/components/modals/actor-profile/actor-profile.component';
import { ManualComponent } from 'src/app/components/modals/manual/manual.component';
import { TutoPopoverComponent } from 'src/app/components/tuto-popover/tuto-popover.component';
import { PopoverAudioPlayerComponent } from 'src/app/components/popover-audio-player/popover-audio-player.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ComponentModule
  ],
  declarations: [ChatPage],
  entryComponents: [
    UploadComponent,
    ActorProfileComponent,
    ManualComponent,
    TutoPopoverComponent,
    PopoverAudioPlayerComponent
  ]
})
export class ChatPageModule {}
