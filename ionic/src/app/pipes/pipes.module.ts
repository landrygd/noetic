import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandPipe } from './command.pipe';
import { CategoryPipe } from './category.pipe';
import { VariablesPipe } from './variables.pipe';
import { ToHtmlPipe } from './to-html.pipe';
import { ObjectValuesPipe } from './object-values.pipe';
import { GetRolesPipe } from './get-roles.pipe';
import { IdToObjectsPipe } from './id-to-objects.pipe';
import { CollectionToIconPipe } from './collection-to-icon.pipe';


@NgModule({
  declarations: [
    CommandPipe,
    CategoryPipe,
    VariablesPipe,
    ToHtmlPipe,
    ObjectValuesPipe,
    ObjectValuesPipe,
    GetRolesPipe,
    IdToObjectsPipe,
    CollectionToIconPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    CommandPipe,
    CategoryPipe,
    VariablesPipe,
    ToHtmlPipe,
    ObjectValuesPipe,
    GetRolesPipe,
    IdToObjectsPipe,
    CollectionToIconPipe
  ]
})
export class PipesModule { }
