import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent implements OnInit, OnDestroy {

  userId = '';

  SEARCHUSER: any;

  searchUserSub: Subscription;

  users: Observable<any>;

  constructor(
    private modalCtrl: ModalController,
    public userService: UserService,
    private translator: TranslateService
    ) { }

  async ngOnInit() {
  }

  getTraduction() {
    this.searchUserSub = this.translator.get('MODALS.SEARCHUSER').subscribe((val) => {
      this.SEARCHUSER = val;
    });
  }

  ngOnDestroy() {
    this.searchUserSub.unsubscribe();
  }

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
