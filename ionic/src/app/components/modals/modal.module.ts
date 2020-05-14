import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UploadComponent } from './upload/upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SearchUserComponent } from './search-user/search-user.component';



@NgModule({
  declarations: [
    UploadComponent,
    SearchUserComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ImageCropperModule
  ],
  exports: [
    UploadComponent,
    SearchUserComponent
  ]
})
export class ModalModule { }
