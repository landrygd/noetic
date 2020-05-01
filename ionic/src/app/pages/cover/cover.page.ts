import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.page.html',
  styleUrls: ['./cover.page.scss'],
})
export class CoverPage implements OnInit {

  name: string;
  desc: string;
  star: number;
  view: number;
  vote: number;
  id: string; // book id
  url: string;
  authorsId: any[] = [];
  authors: any[] = [];
  com: any[] = [];
  tags: any[] = [];

  inList = false;

  comment = {
    userId: this.firebase.userId,
    text: '',
    rate: 0,
    date: 0
  };

  commented = false;
  lastRate = 0;

  constructor(
    public firebase: FirebaseService,
    public navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
    ) { }

  ngOnInit() {
    this.name = this.firebase.book.name;
    this.tags = this.firebase.book.tags;
    this.desc = this.firebase.book.desc;
    this.star = this.firebase.book.star;
    this.view = this.firebase.book.view;
    this.vote = this.firebase.book.vote;
    this.id = this.firebase.book.id;
    this.url = this.firebase.book.cover;
    this.authorsId = this.firebase.book.authors;
    this.inList = this.firebase.haveFromList(this.firebase.book.id);
    this.authorsId.forEach((author) => {
      this.firebase.getUserById(author).subscribe((value) => this.authors.push(value.data()));
    });
    this.firebase.syncComments(this.id);
    this.firebase.haveCommented(this.id).subscribe((value) => {
      if (value.docs.length !== 0) {
        this.comment = value.docs[0].data();
        this.commented = true;
        this.lastRate = this.comment.rate;
      }
    });
  }

  async more() {
    const alert = await this.alertController.create({
      header: 'Verso',
      message: this.firebase.book.verso,
      buttons: ['OK']
    });

    await alert.present();
  }

  play() {
    this.firebase.play(this.id);
  }

  edit() {
    this.firebase.openBook(this.id);
  }

  back() {
    this.firebase.unsyncComments();
    this.navCtrl.back();
  }

  isAuthor() {
    return this.authorsId.includes(this.firebase.userId);
  }

  getStarColor(index) {
    if (index < this.comment.rate) {
      return 'primary';
    }
    return 'medium';
  }

  setRate(index) {
    this.comment.rate = index + 1;
  }

  send() {
    const date = Date.now();
    this.comment.date = date;
    if (this.comment.rate !== 0 ) {
      this.firebase.addComment(this.comment, this.id, this.commented, this.lastRate);
      this.toast('Avis envoyé');
    } else {
      this.toast('Veuillez noter avant d\'envoyer votre avis');
    }
  }

  addToList() {
    this.firebase.addToList(this.firebase.book.id);
    this.toast('Ajouté à la liste');
    this.inList = true;
  }

  removeFromList() {
    this.firebase.removeFromList(this.firebase.book.id);
    this.toast('Retiré de la liste');
    this.inList = false;
  }

  async toast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  starToArray(star) {
    return new Array(star);
  }

  enter(keyCode) {
    if (keyCode === 13) {
      this.send();
    }
  }

  onClick() {}
}
