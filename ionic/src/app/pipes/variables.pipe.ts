import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'variables'
})
export class VariablesPipe implements PipeTransform {

  constructor() {}

  transform(value: string, variables: any, actors: any): any {
    const ponctuation = /(~|`|[?]|!|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|>|\?|\/|\\|\||\+|=)/g;
    value = value.replace(ponctuation, ' $1');
    const words = value.split(' ');
    const res = [];
    for (const word of words) {
      if (word.charAt(0) === '$') {
        const nomVar = this.toVariable(word);
        if (variables.hasOwnProperty(nomVar)) {
          res.push(variables[nomVar]);
        } else {
          res.push(this.toChip(word.substring(1, word.length), 'pricetag'));
        }
      } else if (word.charAt(0) === '@') {
        const subwords = word.split('.');
        const actorName =  this.toVariable(subwords[0]);
        if (subwords.length === 1) {
          res.push(this.toChip(actorName, 'person'));
        } else {
          const nomVar = subwords[1];
          if (actors.hasOwnProperty(actorName)) {
            res.push(actors[actorName][nomVar]);
          } else {
            res.push(this.toChip(nomVar + ' (' + actorName + ')', 'pricetag'));
          }
        }
      } else {
        res.push(word);
      }
    }
    const result = res.join(' ').replace(/[ ](~|`|[?]|!|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|>|\?|\/|\\|\||\+|=)/g, '$1');
    return result;
  }
  bubbleIcon(text) {
    return  + text;
  }
  toChip(text: string, icon: string) {
    return '<ion-chip><ion-label>' + text + '</ion-label></ion-chip>';
  }
  toVariable(text: string) {
    const variable = text.replace('$', '').replace('_', ' ');
    return variable;
  }
}
