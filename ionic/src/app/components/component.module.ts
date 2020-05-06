import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBookComponent } from './card-book/card-book.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from './avatar/avatar.component';
import { ModalModule } from './modals/modal.module';
import { LogComponent } from './log/log.component';
import { UserChipComponent } from './user-chip/user-chip.component';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    CardBookComponent,
    AvatarComponent,
    LogComponent,
    UserChipComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ModalModule,
    PipesModule
  ],
  exports: [
    CardBookComponent,
    AvatarComponent,
    LogComponent,
    UserChipComponent
  ]
})
export class ComponentModule { }
