import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../classes/book';
import { BookService } from '../services/book.service';

@Pipe({
  name: 'getRoles'
})
export class GetRolesPipe implements PipeTransform {

  constructor(private bookService: BookService) {}

  transform(roles: string[]): Role[] {
    const res: Role[] = [];
    roles.forEach((roleName) => res.push(this.bookService.book.getRole(roleName)));
    return res;
  }

}
