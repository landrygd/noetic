import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent implements OnInit {

  userId = '';

  users: Observable<any>;

  constructor(private modalCtrl: ModalController, public userService: UserService) { }

  ngOnInit() {}

  cancel() {
    this.dismiss();
  }

  confirm(userId) {
    this.userId = userId;
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      userId: this.userId
    });
  }

  onSearchChange(text) {
    if (text !== '') {
      const users = this.userService.searchUser(text);
      if (users !== this.users) {
        this.users = users;
      }
    }
  }
}
