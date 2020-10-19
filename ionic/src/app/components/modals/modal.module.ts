import { UploadComponent } from './upload/upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SearchUserComponent } from './search-user/search-user.component';
import { WallpapersSearchComponent } from './wallpapers-search/wallpapers-search.component';
import { ManualComponent } from './manual/manual.component';
import { CommandEntriesComponent } from './command-entries/command-entries.component';
import { TranslateModule } from '@ngx-translate/core';
import { AudioListComponent } from './audio-list/audio-list.component';
import { GalleryComponent } from './gallery/gallery.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FaqComponent } from './faq/faq.component';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  declarations: [
    SearchUserComponent,
    WallpapersSearchComponent,
    ManualComponent,
    CommandEntriesComponent,
    AudioListComponent,
    GalleryComponent,
    UploadComponent,
    FaqComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ImageCropperModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    PipesModule
  ],
  exports: [
    SearchUserComponent,
    WallpapersSearchComponent,
    ManualComponent,
    CommandEntriesComponent,
    AudioListComponent,
    GalleryComponent,
    UploadComponent,
    FaqComponent
  ]
})

export class ModalModule {}
