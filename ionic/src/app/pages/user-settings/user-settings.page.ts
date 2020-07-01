import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit, OnDestroy {

  emailLogged: false;

  USERSETTINGS: any;
  COMMON: any;
  userSettingsSub: Subscription;
  commonSub: Subscription;

  constructor(
    public authService: AuthService,
    private alertController: AlertController,
    public themeService: ThemeService,
    public userService: UserService,
    private translator: TranslateService
    ) {}

    ngOnInit() {
      this.getTraduction();
    }

    getTraduction() {
      this.userSettingsSub = this.translator.get('USERSETTINGS').subscribe((val) => {
        this.USERSETTINGS = val;
      });
      this.commonSub = this.translator.get('COMMON').subscribe((val) => {
        this.COMMON = val;
      });
    }

    ngOnDestroy() {
      this.userSettingsSub.unsubscribe();
      this.commonSub.unsubscribe();
    }

  async changeEmail() {
    const alert = await this.alertController.create({
      header: this.USERSETTINGS.changeMail,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: this.USERSETTINGS.email,
          value: this.authService.auth.email,
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.COMMON.ok,
          handler: (data) => {
            this.authService.changeEmail(data.email);
          }
        }
      ]
    });
    await alert.present();
  }

  async changePassword() {
    this.authService.changePassword();
  }

  toggleDarkMode() {
    this.themeService.toggleAppTheme();
  }


  chooseSpeakingLanguages() {
    this.userService.chooseSpeakingLanguages();
  }

  chooseAppLanguage() {
    this.userService.chooseAppLanguage();
  }
}
