import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChatPageRoutingModule } from './chat-routing.module';
import { ChatPage } from './chat.page';
import { ComponentModule } from 'src/app/components/component.module';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { ManualComponent } from 'src/app/components/modals/manual/manual.component';
import { TutoPopoverComponent } from 'src/app/components/tuto-popover/tuto-popover.component';
import { TranslateModule } from '@ngx-translate/core';
import { LogEditComponent } from 'src/app/components/log-edit/log-edit.component';
import { CommandEntriesComponent } from 'src/app/components/modals/command-entries/command-entries.component';
import { AudioListComponent } from 'src/app/components/modals/audio-list/audio-list.component';
import { EntityModalComponent } from 'src/app/components/modals/entity-modal/entity-modal.component';
import { IdFinderComponent } from 'src/app/components/modals/id-finder/id-finder.component';
import { WallpapersSearchComponent } from 'src/app/components/modals/wallpapers-search/wallpapers-search.component';
import { GalleryComponent } from 'src/app/components/modals/gallery/gallery.component';
import { FaqComponent } from 'src/app/components/modals/faq/faq.component';

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
    EntityModalComponent,
    ManualComponent,
    TutoPopoverComponent,
    LogEditComponent,
    CommandEntriesComponent,
    AudioListComponent,
    IdFinderComponent,
    WallpapersSearchComponent,
    GalleryComponent,
    FaqComponent
  ]
})
export class ChatPageModule {}
