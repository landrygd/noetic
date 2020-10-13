import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'toHtml'
})
export class ToHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, ...args: any[]): any {
    value = value.replace(/:i-([a-z-_]*):/g, '<ion-icon name="$1"></ion-icon>');
    value = value.replace(/(\$[^\s\.]*)/gi, '<strong>$1</strong>');
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
