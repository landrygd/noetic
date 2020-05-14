import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  deleteAccount() {
    this.authService.deleteAccount();
  }

}
