import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TraductionService {

  curLanguage = 'en';

  constructor(
    private translator: TranslateService,
    // tslint:disable-next-line: deprecation
    private globalization: Globalization,
    private plat: Platform
    ) {
    this.curLanguage = this.translator.getBrowserLang();
  }

  async init() {
    const language: string = await this.getLanguage();
    this.translator.setDefaultLang(language);
    this.setLanguage(language);
  }

  async getLanguage(): Promise<string> {
    return new Promise(async (res) => {
      let language: string;
      if (this.plat.is('cordova')) {
        const value = await this.globalization.getPreferredLanguage();
        language = value.value;
      } else {
        language = this.translator.getBrowserLang();
      }
      res(language);
    });
  }

  async getLanguages(): Promise<readonly string[]> {
    return new Promise(async (res) => {
      let language: readonly string[];
      if (this.plat.is('cordova')) {
        const value = await this.globalization.getPreferredLanguage();
        language = [value.value];
      } else {
        language = navigator.languages;
      }
      res(language);
    });
  }

  setLanguage(lng) {
    this.translator.use(lng);
    this.curLanguage = lng;
  }

  getCurLanguage() {
    return this.curLanguage;
  }
}
