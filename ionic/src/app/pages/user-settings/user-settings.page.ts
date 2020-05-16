import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

  constructor(
    public authService: AuthService,
    private alertController: AlertController,
    public themeService: ThemeService
    ) {
      console.log(this.themeService.darkMode);
     }

  ngOnInit() {
  }

  async changeEmail() {
    const alert = await this.alertController.create({
      header: 'Changer d\'adresse mail',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
          value: this.authService.auth.email,
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
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
}
