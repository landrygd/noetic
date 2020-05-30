import { Component, OnInit } from '@angular/core';
import { NotifService } from 'src/app/services/user/notif.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notifs',
  templateUrl: './notifs.page.html',
  styleUrls: ['./notifs.page.scss'],
})
export class NotifsPage implements OnInit {

  questions = [
    'invBook'
  ];

  constructor(
    public notifService: NotifService,
    public userService: UserService
    ) { }

  ngOnInit() {
  }

  isQuestion(type) {
    return this.questions.includes(type);
  }

  accept(notif) {
    this.notifService.acceptInvitation(notif.user, notif.book);
    this.erase(notif);
  }

  refuse(notif) {
    this.erase(notif);
  }

  erase(notif) {
    this.notifService.eraseNotif(notif.id);
  }

}
