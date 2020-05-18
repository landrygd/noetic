import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TraductionService } from './services/traductionService.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { NetworkService } from './services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public network: NetworkService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translator: TraductionService,
    private authService: AuthService,
    public themeService: ThemeService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.translator.init();
  }
}
