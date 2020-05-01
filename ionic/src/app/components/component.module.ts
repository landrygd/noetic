import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBookComponent } from './card-book/card-book.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from './avatar/avatar.component';
import { ModalModule } from './modals/modal.module';
import { LogComponent } from './log/log.component';



@NgModule({
  declarations: [
    CardBookComponent,
    AvatarComponent,
    LogComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ModalModule
  ],
  exports: [
    CardBookComponent,
    AvatarComponent,
    LogComponent
  ]
})
export class ComponentModule { }
