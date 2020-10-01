import { Pipe, PipeTransform } from '@angular/core';
import { Entity } from '../classes/book';
import { BookService } from '../services/book.service';

@Pipe({
  name: 'getRoles'
})
export class GetRolesPipe implements PipeTransform {

  constructor(private bookService: BookService) {}

  transform(roles: string[]): Entity[] {
    const res: Entity[] = [];
    roles.forEach((roleName) => res.push(this.bookService.book.getEntity(roleName)));
    return res;
  }

}
