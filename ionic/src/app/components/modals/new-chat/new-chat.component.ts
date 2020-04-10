import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent implements OnInit {
  
  chat = {
    name: '',
    desc: '',
    logs: []
  }

  constructor(private modalCtrl: ModalController, public firebase: FirebaseService) { }

  ngOnInit() {}

  cancel() {
    this.dismiss();
  }

  confirm() {
    this.firebase.addChat(this.chat);
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
