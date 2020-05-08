import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ComponentModule } from 'src/app/components/component.module';
import { NewActorComponent } from 'src/app/components/modals/new-actor/new-actor.component';
import { NewQuestionComponent } from 'src/app/components/modals/new-question/new-question.component';

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
    NewActorComponent,
    NewQuestionComponent
  ]
})
export class ChatPageModule {}
