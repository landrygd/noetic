import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandPipe } from './command.pipe';
import { CategoryPipe } from './category.pipe';
import { VariablesPipe } from './variables.pipe';
import { ToHtmlPipe } from './to-html.pipe';


@NgModule({
  declarations: [ CommandPipe, CategoryPipe, VariablesPipe, ToHtmlPipe],
  imports: [
    CommonModule
  ],
  exports: [CommonModule, CommandPipe, CategoryPipe, VariablesPipe, ToHtmlPipe]
})
export class PipesModule { }
