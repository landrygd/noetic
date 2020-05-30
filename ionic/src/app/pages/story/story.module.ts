import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoryPageRoutingModule } from './story-routing.module';

import { StoryPage } from './story.page';
import { ComponentModule } from 'src/app/components/component.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoryPageRoutingModule,
    ComponentModule,
    TranslateModule
  ],
  declarations: [StoryPage]
})
export class StoryPageModule {}
