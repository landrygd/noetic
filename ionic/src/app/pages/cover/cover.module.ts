import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoverPageRoutingModule } from './cover-routing.module';

import { CoverPage } from './cover.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoverPageRoutingModule,
    PipesModule,
    ComponentModule,
    TranslateModule
  ],
  declarations: [CoverPage],
  entryComponents: [UploadComponent]
})
export class CoverPageModule {}
