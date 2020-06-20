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
import { TranslateModule } from '@ngx-translate/core';
import { LogEditComponent } from 'src/app/components/log-edit/log-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ComponentModule,
    TranslateModule
  ],
  declarations: [ChatPage],
  entryComponents: [
    UploadComponent,
    ActorProfileComponent,
    ManualComponent,
    TutoPopoverComponent,
    LogEditComponent
  ]
})
export class ChatPageModule {}
