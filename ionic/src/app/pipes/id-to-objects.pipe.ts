import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idToObjects'
})
export class IdToObjectsPipe implements PipeTransform {

  transform(entities: any, idList: string[]): any[] {
    const res = [];
    for (const id of idList) {
      res.push(entities[id]);
    }
    return res;
  }

}
