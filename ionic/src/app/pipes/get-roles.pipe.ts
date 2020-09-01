import { Pipe, PipeTransform } from '@angular/core';
import { BookService } from '../services/book.service';

@Pipe({
  name: 'getRoles'
})
export class GetRolesPipe implements PipeTransform {

  constructor() {}

  transform(entities: {}, roles: string[]): any {
    const res: any[] = [];
    roles.forEach((roleName) => res.push(entities[roleName]));
    return res;
  }

}
