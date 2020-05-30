import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TraductionService {

  curLanguage = 'en';

  constructor(private translator: TranslateService) {
    this.curLanguage = this.translator.getBrowserLang();
  }

  init() {
    const language = this.translator.getBrowserLang();
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
