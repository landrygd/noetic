import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
  name: 'command'
})
export class CommandPipe implements PipeTransform {

  command: string;
  opts: any[] = [];
  arg: string;
  args: string[] = [];

  constructor() { }

  transform(value: string): any {
    let res = value;
    if (res.charAt(0) === '/') {
      if (res.charAt(1) === '/') {
        res = '<ion-text color="medium">' +
              '<p>' + res + '</p>' +
              '</ion-text>';
      } else {
        this.getCommandValues(value);
        let icon = 'help';
        let argChip = '<ion-chip>' + this.arg + '</ion-chip>';
        const nomVar = this.args[0];
        const varValue = this.args[1];
        const varValue2 = this.args[2];
        switch (this.command) {
          case 'go':
            icon = 'arrow-forward';
            if (this.opts.includes('chat')) {
              res = 'Aller au chat ' + argChip;
            } else {
              res = 'Aller au label ' + argChip;
            }
            break;
          case 'label':
            icon = 'bookmark';
            res = 'Label ' + argChip;
            break;
          case 'question':
            icon = 'chatbubble';
            const answers = this.arg.split(';');
            argChip = '';
            for (const ans of answers) {
              argChip += this.toChip(ans, 'chatbubble');
            }
            res = 'Poser une question avec les réponses:' + argChip;
            break;
          case 'if':
            icon = 'settings';
            const endVal = this.args.slice(2, this.args.length).join(' ');
            switch (varValue) {
              case '=':
              case '==':
              case '===':
                res = 'Si ' + nomVar + ' est égal à ' + endVal;
                break;
              case '!=':
              case '!==':
                res = 'Si ' + nomVar + ' n\'est pas égal à ' + endVal;
                break;
              case '<=':
                res = 'Si ' + nomVar + ' est inférieur ou égal à ' + endVal;
                break;
              case '<':
                res = 'Si ' + nomVar + ' est strictement inférieur à ' + endVal;
                break;
              case '>=':
                res = 'Si ' + nomVar + ' est supérieur ou égal à ' + endVal;
                break;
              case '>':
                res = 'Si ' + nomVar + ' est supérieur à ' + endVal;
                break;
            }
            break;
          case 'else':
            icon = 'settings';
            res = 'Sinon continuer';
            break;
          case 'set':
            icon = 'settings';
            res = 'Mettre ' + nomVar + ' à ' + varValue;
            break;
          case 'add':
            icon = 'settings';
            res = 'Ajouter ' + varValue + ' à ' + nomVar;
            break;
          case 'sub':
            icon = 'settings';
            res = 'Soustraire ' + varValue + ' à ' + nomVar;
            break;
          case 'div':
            icon = 'settings';
            res = 'Diviser ' + nomVar + ' par ' + varValue;
            break;
          case 'mul':
            icon = 'settings';
            res = 'Multiplier ' + nomVar + ' par ' + varValue;
            break;
          case 'wait':
            icon = 'hourglass';
            res = 'Attendre ' + nomVar + ' secondes.';
            break;
          case 'input':
            icon = 'text';
            if (this.opts.includes('type')) {
              res = 'Demander une valeur pour ' + nomVar + ' de type ' + varValue;
            } else {
              res = 'Demander une valeur pour ' + nomVar;
            }
            break;
          case 'random':
            icon = 'settings';
            let min: number;
            let max: number;
            if (varValue2) {
              min = Math.floor(Number(varValue));
              max = Math.floor(Number(varValue2));
            } else {
              min = 0;
              max = Math.floor(Number(varValue));
            }
            res = 'Choisir un entier aléatoire entre ' + min + ' et ' + max + ' inclus pour ' + nomVar;
            break;
          case 'sound':
            icon = 'volume-medium';
            res = 'Jouer le son ' + this.toChip(this.arg, 'volume-medium');
            break;
          case 'ambiance':
            if (this.opts.includes('stop')) {
              icon = 'volume-mute';
              if (this.args.length !== 0) {
                res = 'Arêter l\'ambiance' + this.toChip(this.args[0], 'ear');
              } else {
                res = 'Arêter toutes les ambiances';
              }
            } else {
              icon = 'ear';
              res = 'Jouer l\'ambiance ' + this.toChip(this.arg, 'ear');
            }
            break;
          case 'alert':
            icon = 'alert';
            res = 'Monter une alerte avec le message: "' + this.arg + '"';
            break;
          case 'music':
            if (this.opts.includes('stop')) {
              icon = 'volume-mute';
              res = 'Arêter la musique';
            } else {
              icon = 'musical-notes';
              res = 'Jouer la musique ' + this.toChip(this.arg, 'musical-notes');
            }
            break;
          case 'control':
            icon = 'people';
            res = 'Contrôler le personnage ' + this.arg;
            break;
          case 'end':
            icon = 'flag';
            res = 'Fin de l\'histoire';
            break;
          default:
            res = 'commande inconnue';
        }
        res = '<ion-icon name="' + icon + '"></ion-icon>   ' + res;
      }
    }
    return res;
  }

  toChip(text: string, icon: string = '') {
    return '<ion-chip><ion-icon name="' + icon + '"></ion-icon><ion-label>' + text + '</ion-label></ion-chip>';
  }

  getCommandValues(str: string) {
    const words: string[] = str.split(' ');
    const firstWord = words.shift();
    this.command = firstWord.slice(1);
    let opt = true;
    this.arg = '';
    this.args = [];
    this.opts = [];
    for (const word of words) {
      if (word.charAt(0) === '-' && opt) {
        this.opts.push(word.slice(1));
      } else {
        if (opt) {
          opt = false;
          this.arg = word;
          this.args.push(word);
        } else {
          this.arg += ' ' + word;
          this.args.push(word);
        }
      }
    }
    return;
  }

}
