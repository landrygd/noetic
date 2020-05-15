import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from 'time-ago-pipe';
import { CommandPipe } from './command.pipe';
import { CategoryPipe } from './category.pipe';



@NgModule({
  declarations: [TimeAgoPipe, CommandPipe, CategoryPipe],
  imports: [
    CommonModule
  ],
  exports: [TimeAgoPipe, CommandPipe, CategoryPipe]
})
export class PipesModule { }
