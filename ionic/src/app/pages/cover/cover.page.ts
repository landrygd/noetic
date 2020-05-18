import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';
import { CommentService } from 'src/app/services/book/comment.service';
import { AuthService } from 'src/app/services/auth.service';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { PopupService } from 'src/app/services/popup.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.page.html',
  styleUrls: ['./cover.page.scss'],
})
export class CoverPage implements OnInit {
  com: any[] = [];
  tags: any[] = [];

  selectedAnswer = -1;

  inList = false;
  curBookId: string;

  comment = {
    userId: this.userService.userId,
    text: '',
    rate: 0,
    date: 0
  };

  commented = false;
  lastRate = 0;
  loading = true;

  constructor(
    public navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    public authService: AuthService,
    public userService: UserService,
    public bookService: BookService,
    public commentService: CommentService,
    private modalController: ModalController,
    private popupService: PopupService,
    private route: ActivatedRoute,
    ) {
      // if (!this.bookService.curBookId) {
      //   this.navCtrl.pop();
      // } else {
      //   this.curBookId = this.bookService.curBookId;
      // }
    }

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id');
    this.curBookId = bookId;
    if (this.bookService.curBookId !== bookId) {
      this.bookService.curBookId = this.curBookId;
      this.bookService.syncBook(this.curBookId, true)
      .then(() => {
        this.loading = false;
        this.commentService.syncComments(this.bookService.book.id);
        if (this.authService.connected) {
          this.inList = this.userService.haveFromList(this.bookService.book.id);
          this.commentService.haveCommented(this.bookService.book.id).subscribe((value) => {
            if (value.length !== 0) {
              this.comment = value[0];
              this.commented = true;
              this.lastRate = this.comment.rate;
            }
          });
        }
      })
      .catch((err) => {
        this.navCtrl.navigateBack('tabs/home');
        this.popupService.error(err);
      });
    } else {
      this.loading = false;
    }
  }

  async answer(userId) {
    const alert = await this.alertController.create({
      header: 'Répondre',
      inputs: [
        {
          name: 'answer',
          id: 'answer',
          type: 'textarea',
          placeholder: 'Entrez votre réponse'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Envoyer',
          handler: (data) => {
            this.commentService.answerToComment(this.bookService.book.id, userId, data.answer);
          }
        }
      ]
    });
    await alert.present();
  }

  async more() {
    const alert = await this.alertController.create({
      header: 'Verso',
      message: this.bookService.book.verso,
      buttons: ['OK']
    });

    await alert.present();
  }

  changeCat(cat) {
    this.bookService.updateBookData({cat});
  }

  play() {
    this.bookService.play(this.bookService.book.id);
  }

  edit() {
    this.bookService.openBook(this.bookService.book.id);
  }

  back() {
    this.commentService.unsyncComments();
    this.bookService.unsyncBook(true);
    this.navCtrl.navigateBack('/tabs/home');
  }

  share() {
    this.bookService.shareBook(this.curBookId);
  }

  async addTag() {
    if (this.bookService.book.tags.length < 5) {
      const alert = await this.alertController.create({
        header: 'Ajouter un tag',
        inputs: [
          {
            name: 'tag',
            type: 'text',
            placeholder: 'Nom du tag',
          }
        ],
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Confirmer',
            handler: (data) => {
              const tags = this.bookService.book.tags;
              tags.push(data.tag);
              this.bookService.updateBookData({tags});
            }
          }
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        message: 'Impossible d\'avoir plus de 5 tags pour un même livre.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  removeTag(index) {
    const tags = this.bookService.book.tags;
    tags.splice(index, 1);
    this.bookService.updateBookData({tags});
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
      this.commentService.addComment(this.comment, this.bookService.book.id, this.commented, this.lastRate);
      this.toast('Avis envoyé');
    } else {
      this.toast('Veuillez noter avant d\'envoyer votre avis');
    }
  }

  addToList() {
    this.userService.addBookListRef(this.bookService.book.id);
    this.toast('Ajouté à la liste');
    this.inList = true;
  }

  removeFromList() {
    this.userService.deleteBookListRef(this.bookService.book.id);
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

  starAverageToArray() {
    const size = Math.round(this.bookService.book.stars / Math.max(this.bookService.book.votes, 1));
    console.log(size);
    return new Array(size);
  }

  enter(keyCode) {
    if (keyCode === 13) {
      this.send();
    }
  }

  onClick() {}

  showAnswer(index) {
    this.selectedAnswer = index;
  }

  hideAnswer() {
    this.selectedAnswer = -1;
  }

  async changeTitle() {
    const alert = await this.alertController.create({
      header: 'Changer de titre',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Votre titre',
          value: this.bookService.book.title,
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirmer',
          handler: (data) => {
            const title = data.title;
            if (title.length < 3) {
              this.popupService.alert('Le titre doit faire au moins plus de 3 caractères');
              return;
            } else if (title.length > 40) {
              this.popupService.alert('Le titre doit faire moins 40 caractères');
              return;
            }
            this.bookService.updateBookData({title});
          }
        }
      ]
    });
    await alert.present();
  }

  async changeDesc() {
    const alert = await this.alertController.create({
      header: 'Changer de description (courte)',
      inputs: [
        {
          name: 'desc',
          type: 'text',
          placeholder: 'Votre description',
          value: this.bookService.book.desc,
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirmer',
          handler: (data) => {
            this.bookService.updateBookData({desc: data.desc});
          }
        }
      ]
    });
    await alert.present();
  }

  async changeVerso() {
    const alert = await this.alertController.create({
      header: 'Changer de verso',
      inputs: [
        {
          name: 'verso',
          type: 'textarea',
          placeholder: 'Votre verso',
          value: this.bookService.book.verso,
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirmer',
          handler: (data) => {
            this.bookService.updateBookData({verso: data.verso});
          }
        }
      ]
    });
    await alert.present();
  }

  async changeCover() {
    if (this.bookService.isAuthor) {
      const modal = await this.modalController.create({
        component: UploadComponent,
        componentProps: {
          type: 'cover',
        }
      });
      modal.onDidDismiss()
        .then((data) => {
          if (data.data) {
            this.bookService.uploadCover(data.data);
          }
      });
      return await modal.present();
    }
  }
}
