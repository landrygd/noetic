import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewActionComponent } from './new-action/new-action.component';
import { NewActorComponent } from './new-actor/new-actor.component';
import { NewBookComponent } from './new-book/new-book.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { NewPlaceComponent } from './new-place/new-place.component';
import { NewObjectComponent } from './new-object/new-object.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewQuestionComponent } from './new-question/new-question.component';
import { UploadComponent } from './upload/upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [
    NewActionComponent,
    NewActorComponent,
    NewBookComponent,
    NewChatComponent,
    NewPlaceComponent,
    NewObjectComponent,
    NewQuestionComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ImageCropperModule
  ],
  exports: [
    NewActionComponent,
    NewActorComponent,
    NewBookComponent,
    NewChatComponent,
    NewPlaceComponent,
    NewObjectComponent,
    NewQuestionComponent,
    UploadComponent
  ]
})
export class ModalModule { }
