import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.scss'],
})
export class NewBookComponent implements OnInit {

  book = {
    name: '',
    desc: '',
    first: 'main',
    rating: 0,
    view: 0
  }

  constructor(private modalCtrl: ModalController, public firebase: FirebaseService) { }

  ngOnInit() {}

  cancel() {
    this.dismiss();
  }

  confirm() {
    this.firebase.addBook(this.book);
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
