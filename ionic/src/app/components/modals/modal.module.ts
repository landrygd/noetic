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


@NgModule({
  declarations: [
    SearchUserComponent,
    WallpapersSearchComponent,
    ManualComponent,
    CommandEntriesComponent,
    AudioListComponent,
    GalleryComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ImageCropperModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ],
  exports: [
    SearchUserComponent,
    WallpapersSearchComponent,
    ManualComponent,
    CommandEntriesComponent,
    AudioListComponent,
    GalleryComponent
  ]
})

export class ModalModule {}
