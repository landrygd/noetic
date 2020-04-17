import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewBookPageRoutingModule } from './new-book-routing.module';

import { NewBookPage } from './new-book.page';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewBookPageRoutingModule,
    ComponentModule,
    ReactiveFormsModule
  ],
  declarations: [NewBookPage],
  entryComponents: [UploadComponent]
})
export class NewBookPageModule {}
