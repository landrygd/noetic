import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookEndPageRoutingModule } from './book-end-routing.module';

import { BookEndPage } from './book-end.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookEndPageRoutingModule
  ],
  declarations: [BookEndPage]
})
export class BookEndPageModule {}
