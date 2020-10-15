import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = true;

  constructor(private plt: Platform, private storage: Storage) {
    this.plt.ready().then(() => {

      this.storage.get('DARK_MODE').then(theme => {
        this.setAppTheme(theme);
      }).catch(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        // tslint:disable-next-line: deprecation
        prefersDark.addListener(e => {
          this.setAppTheme(e.matches);
        });
      });
    });
   }

   toggleAppTheme() {
    this.darkMode = !this.darkMode;
    this.setAppTheme(this.darkMode);
   }

   setAppTheme(dark) {
    this.darkMode = dark;
    this.storage.set('DARK_MODE', this.darkMode);

    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
   }
}
