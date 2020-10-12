import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { IonicModule } from '@ionic/angular';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgxDropzoneModule,
    ImageCropperModule
  ],
  exports: [UploadComponent]
})
export class UploadModule { }
