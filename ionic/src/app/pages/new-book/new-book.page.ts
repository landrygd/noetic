import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.page.html',
  styleUrls: ['./new-book.page.scss'],
})

export class NewBookPage implements OnInit {
  book = {
    name: '',
    desc: '',
    first: 'main',
    star: 0,
    view: 0,
    tags:[]
  }
  cover: string;

  tag:string;
  constructor(private modalCtrl: ModalController, public firebase: FirebaseService, private sanitization:DomSanitizer) {
   }

  ngOnInit() {}

  cancel() {
    this.dismiss();
  }

  confirm() {
    this.firebase.addBook(this.book, this.cover);
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async changeCover() {
    const modal = await this.modalCtrl.create({
      component: UploadComponent,
      componentProps: {
        type: 'cover'
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.cover = data['data'];
    });
    return await modal.present();
  }

  enter(keyCode) {
    if (keyCode == 13) {
      this.addTag();
    }
  }

  addTag() {
    this.book.tags.push(this.tag);
    this.tag = "";
  }

}

