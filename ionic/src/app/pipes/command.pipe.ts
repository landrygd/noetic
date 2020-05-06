import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
  name: 'command'
})
export class CommandPipe implements PipeTransform {

  command: string;
  opts: any[] = [];
  arg: string;

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string, ...args: any[]): any {
    let res = value;
    if (res.charAt(0) === '/') {
      if (res.charAt(1) === '/') {
        res = '<ion-text color="medium">' +
              '<p>' + res + '</p>' +
              '</ion-text>';
      } else {
        this.getCommandValues(value);
        let icon = 'help';
        const argChip = '<ion-chip>' + this.arg + '</ion-chip>';
        switch (this.command) {
          case 'g':
          case 'go':
            icon = 'arrow-forward';
            if (this.opts.includes('chat')) {
              res = 'Aller au chat ' + argChip;
            } else {
              res = 'Aller au label ' + argChip;
            }
            break;
          case 'l':
          case 'label':
            icon = 'bookmark';
            res = 'Label ' + argChip;
            break;
          case 'sound':
            icon = 'volume-medium';
            res = 'Jouer le son ' + argChip;
            break;
          case 'alert':
            icon = 'alert';
            res = 'Monter une alerte avec le message: "' + this.arg + '"';
            break;
          case 'music':
            icon = 'musical-notes';
            res = 'Jouer la musique ' + argChip;
            break;
          default:
            res = 'commande inconnue';
        }
        res = '<ion-icon name="' + icon + '"></ion-icon>   ' + res;
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(res);
  }

  getCommandValues(str: string) {
    const words: string[] = str.split(' ');
    const firstWord = words.shift();
    this.command = firstWord.slice(1);
    let opt = true;
    this.arg = '';
    for (const word of words) {
      if (word.charAt(0) === '-' && opt) {
        this.opts.push(word.slice(1));
      } else {
        if (opt) {
          opt = false;
          this.arg = word;
        } else {
          this.arg += ' ' + word;
        }
      }
    }
    return;
  }

}
