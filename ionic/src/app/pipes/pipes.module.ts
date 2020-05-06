import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from 'time-ago-pipe';
import { CommandPipe } from './command.pipe';



@NgModule({
  declarations: [TimeAgoPipe, CommandPipe],
  imports: [
    CommonModule
  ],
  exports: [TimeAgoPipe, CommandPipe]
})
export class PipesModule { }
