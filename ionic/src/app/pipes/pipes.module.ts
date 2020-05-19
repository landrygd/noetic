import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from 'time-ago-pipe';
import { CommandPipe } from './command.pipe';
import { CategoryPipe } from './category.pipe';
import { VariablesPipe } from './variables.pipe';
import { ToHtmlPipe } from './to-html.pipe';



@NgModule({
  declarations: [TimeAgoPipe, CommandPipe, CategoryPipe, VariablesPipe, ToHtmlPipe],
  imports: [
    CommonModule
  ],
  exports: [TimeAgoPipe, CommandPipe, CategoryPipe, VariablesPipe, ToHtmlPipe]
})
export class PipesModule { }
