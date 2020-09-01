import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'collectionToIcon'
})
export class CollectionToIconPipe implements PipeTransform {

  transform(collection: string, ...args: any[]): any {
    switch (collection) {
      case 'items':
        return 'cube';
      case 'places':
        return 'location';
      case 'actors':
        return 'person';
      case 'chats':
        return 'chatbox';
      case 'roles':
        return 'at';
    }
  }

}
