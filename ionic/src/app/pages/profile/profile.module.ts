import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { ComponentModule } from 'src/app/components/component.module';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ComponentModule,
    ImageCropperModule
  ],
  declarations: [ProfilePage],
  entryComponents: [UploadComponent]
})
export class ProfilePageModule {}
