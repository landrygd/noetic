import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TraductionService } from './services/traductionService.service';
import { ThemeService } from './services/theme.service';
import { NetworkService } from './services/network.service';
import { BookService } from './services/book.service';
import { UserService } from './services/user.service';
import { User } from './classes/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  categories: string[];

  constructor(
    private translator: TraductionService,
    // tslint:disable-next-line: no-shadowed-variable
    public AuthService: AuthService,
    private platform: Platform,
    public network: NetworkService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public themeService: ThemeService,
    private bookService: BookService,
    public userService: UserService
  ) {
    this.initializeApp();
    this.categories = this.bookService.categories;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.translator.init();
  }

  onClick() {}
}
