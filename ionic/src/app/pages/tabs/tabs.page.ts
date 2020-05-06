import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public navCtrl: NavController,
    public userService: UserService
    ) {}

  addBook() {
    this.navCtrl.navigateForward('new-book');
  }

  openProfile() {
    this.userService.setUser();
  }
}
