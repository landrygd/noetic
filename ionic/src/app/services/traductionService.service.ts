import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TraductionService {

  curLanguage:string = 'en';

  constructor(private translator: TranslateService) { 
  }

  init() {
    let language = this.translator.getBrowserLang();
    this.translator.setDefaultLang(language);
    this.setLanguage(language);
  }

  setLanguage(lng) {
    this.translator.use(lng);
    this.curLanguage = lng;
  }

  getCurLanguage() {
    return this.curLanguage;
  }
}
