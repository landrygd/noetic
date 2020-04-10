import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoryPageRoutingModule } from './story-routing.module';

import { StoryPage } from './story.page';
import { ComponentModule } from 'src/app/components/component.module';
import { NewChatComponent } from 'src/app/components/modals/new-chat/new-chat.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoryPageRoutingModule,
    ComponentModule
  ],
  declarations: [StoryPage],
  entryComponents: [NewChatComponent]
})
export class StoryPageModule {}
