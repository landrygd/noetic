import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-new-actor',
  templateUrl: './new-actor.component.html',
  styleUrls: ['./new-actor.component.scss'],
})
export class NewActorComponent implements OnInit {

  actor = {
    name: '',
    desc: ''
  }

  constructor(private modalCtrl: ModalController, public firebase: FirebaseService) { }

  ngOnInit() {}

  cancel() {
    this.dismiss();
  }

  confirm() {
    this.firebase.addActor(this.actor);
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
