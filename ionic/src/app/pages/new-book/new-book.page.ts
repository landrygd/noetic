import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
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
    vote: 0,
    view: 0,
    tags:[],
    cover: "../../../assets/cover/cover1.png",
    cat:'undefined',
    authors:[],
    verso:""
  }
  coverSize = "cover";
  cover: string = "../../../assets/cover/cover1.png";

  tag:string;
  constructor(public firebase: FirebaseService, private sanitization:DomSanitizer, public modalCtrl: ModalController, public nacCtrl: NavController) {
    const max = 3;
    const min = 1;
    const coverNumber = Math.floor(Math.random()*(max-min+1)+min);
    this.book.cover = "../../../assets/cover/cover"+coverNumber+".png";
    this.cover = this.book.cover;
    this.book.authors.push(this.firebase.userId);
   }

  ngOnInit() {}

  confirm() {
    this.firebase.addBook(this.book, this.cover);
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
        if(data['data']) {
          this.cover = data['data'];
          this.coverSize = '';
          setTimeout(()=>this.coverSize = 'cover',50);
        }
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

  back() {
    this.nacCtrl.back();
  }

}

