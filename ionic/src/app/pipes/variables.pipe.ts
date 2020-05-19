import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'variables'
})
export class VariablesPipe implements PipeTransform {

  transform(value: string, variables: any, debug = false): any {
    const words = value.split(' ');
    const res = [];
    for (const word of words) {
      if (word.charAt(0) === '$') {
        const nomVar = this.toVariable(word);
        if (variables.hasOwnProperty(nomVar)) {
          res.push(variables[nomVar]);
        } else if (nomVar === 'answer') {
          res.push(this.toChip('réponse', 'chatbubble'));
        } else {
          res.push(this.toChip(word.substring(1, word.length), 'pricetag'));
        }
      } else {
        res.push(word);
      }
    }
    return res.join(' ');
  }
  bubbleIcon(text) {
    return  + text;
  }
  toChip(text: string, icon: string) {
    return '<ion-chip><ion-icon name="' + icon + '"></ion-icon><ion-label>' + text + '</ion-label></ion-chip>';
  }
  toVariable(text: string) {
    return text.substring(1, text.length);
  }
}
