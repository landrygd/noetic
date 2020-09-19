import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeToIcon'
})
export class TypeToIconPipe implements PipeTransform {

  transform(collection: string, ...args: any[]): any {
    switch (collection) {
      case 'item':
        return 'cube';
      case 'place':
        return 'location';
      case 'actor':
        return 'person';
      case 'script':
        return 'chatbox';
      case 'role':
        return 'at';
    }
  }

}
