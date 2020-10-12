import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Commands from '../../assets/json/commands.json';


@Pipe({
  name: 'command'
})
export class CommandPipe implements PipeTransform {

  command: string;
  opts: any[] = [];
  arg: string;
  args: string[] = [];

  commandSub: Subscription;
  COMMANDS: any = {};

  constructor(
    private translator: TranslateService
  ) {
    this.getTraduction();
  }

  async getTraduction() {
    this.commandSub = this.translator.get('COMMANDS').subscribe((val) => {
      this.COMMANDS = val;
    });
  }

  transform(value: string): any {
    let res = value;
    let icon = 'help';
    if (res.charAt(0) === '/') {
      if (res.charAt(1) === '/') {
        res = '<ion-text color="medium">' +
              '<p>' + res + '</p>' +
              '</ion-text>';
      } else {
        this.getCommandValues(value);
        if (Commands[this.command]) {
          icon = Commands[this.command].icon;
        }
        if (this.COMMANDS[this.command]) {
          res = this.COMMANDS[this.command].show;
          res = res.replace('§1', this.toChip(this.args[0])).replace('§2', this.toChip(this.args[1]))
                   .replace('§3', this.toChip(this.args[2])).replace('§*', this.toChip(this.args.slice(0, this.args.length).join(' ')));
        } else {
          res = this.COMMANDS.unknowed.show;
        }
        res = '<ion-icon name="' + icon + '"></ion-icon>   ' + res;
      }
    }
    return res;
  }

  toChip(text: string) {
    return '<strong> ' + text + ' </strong>';
  }

  getCommandValues(str: string) {
    const words: string[] = str.split(' ');
    const firstWord = words.shift();
    this.command = firstWord.slice(1).toLocaleLowerCase();
    let opt = true;
    this.arg = '';
    this.args = [];
    this.opts = [];
    for (const word of words) {
      const subword = word;
      // if (word.length > 7) {
      //   subword = word.substring(0, 7) + '...';
      // }
      if (word.charAt(0) === '-' && opt) {
        this.opts.push(word.slice(1));
      } else {
        if (opt) {
          opt = false;
          this.arg = word;
          this.args.push(subword);
        } else {
          this.arg += ' ' + word;
          this.args.push(subword);
        }
      }
    }
    // if (this.arg.length > 7) {
    //   this.arg = this.arg.substring(0, 7) + '...';
    // }
    return;
  }

}
