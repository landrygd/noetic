import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-notifs',
  templateUrl: './notifs.page.html',
  styleUrls: ['./notifs.page.scss'],
})
export class NotifsPage implements OnInit {

  questions = [
    'invBook'
  ];

  constructor(public firebase: FirebaseService) { }

  ngOnInit() {
  }

  isQuestion(type) {
    return this.questions.includes(type);
  }

  accept(notif) {
    this.firebase.acceptInvitation(notif.user, notif.book);
    this.erase(notif);
  }

  refuse(notif) {
    this.erase(notif);
  }

  erase(notif) {
    this.firebase.eraseNotif(notif.id);
  }

}
