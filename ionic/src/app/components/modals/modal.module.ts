import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UploadComponent } from './upload/upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SearchUserComponent } from './search-user/search-user.component';
import { WallpapersSearchComponent } from './wallpapers-search/wallpapers-search.component';



@NgModule({
  declarations: [
    UploadComponent,
    SearchUserComponent,
    WallpapersSearchComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ImageCropperModule
  ],
  exports: [
    UploadComponent,
    SearchUserComponent,
    WallpapersSearchComponent
  ]
})

export class ModalModule {}
