import { Pipe, PipeTransform } from '@angular/core';
import { ActorService } from '../services/book/actor.service';

@Pipe({
  name: 'variables'
})
export class VariablesPipe implements PipeTransform {

  constructor(private actorService: ActorService) {}

  transform(value: string, variables: any, actors: any): any {
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
      } else if (word.charAt(0) === '@') {
        const subwords = word.split('$');
        const actorName =  this.toVariable(subwords[0]);
        const actorId =  this.actorService.getActorId(actorName);
        if (subwords.length === 1) {
          res.push(this.toChip(actorName, 'person'));
        } else {
          const nomVar = subwords[1];
          if (actors.hasOwnProperty(actorId)) {
            res.push(actors[actorId][nomVar]);
          } else {
            res.push(this.toChip(nomVar, 'pricetag') + ' de ' + this.toChip(actorName, 'person'));
          }
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
    return text.substring(1, text.length).replace('_', ' ');
  }
}
