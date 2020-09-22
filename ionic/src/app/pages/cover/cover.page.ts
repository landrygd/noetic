import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { NavController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';
import { AuthService } from 'src/app/services/auth.service';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { PopupService } from 'src/app/services/popup.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Book } from 'src/app/classes/book';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.page.html',
  styleUrls: ['./cover.page.scss'],
})
export class CoverPage implements OnInit, OnDestroy {
  com: any[] = [];
  tags: any[] = [];

  selectedAnswer = -1;

  inList = false;

  comment: {
    userId: string,
    text: string,
    rate: number,
    date: number
  } = {
    userId: this.userService.userId,
    text: '',
    rate: 0,
    date: 0
  };

  commented = false;
  lastRate = 0;
  loading = true;
  editComment = false;

  ERRORS: any = {};
  COVER: any = {};
  COMMON: any = {};

  coverSub: Subscription;
  errosSub: Subscription;
  commonSub: Subscription;

  haveCommentedSub: Subscription;

  background = 'url("../../../assets/banner.png")';

  verso = false;

  book: Book = new Book();

  @ViewChild('banner', {static: true, read: ElementRef}) banner: ElementRef;

  comments: {date: number, text: string; userId: string; answer: string}[] = [];

  constructor(
    public navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    public authService: AuthService,
    public userService: UserService,
    public bookService: BookService,
    private modalController: ModalController,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private translator: TranslateService
    ) {}

  ngOnInit() {
    this.getTraduction();
  }

  getTraduction() {
    this.errosSub = this.translator.get('ERRORS').subscribe((val) => {
      this.ERRORS = val;
    });
    this.coverSub = this.translator.get('COVER').subscribe((val) => {
      this.COVER = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.coverSub.unsubscribe();
    this.errosSub.unsubscribe();
    this.commonSub.unsubscribe();
  }

  async ionViewWillEnter() {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookService.book) {
      this.book = this.bookService.book;
    } else {
      await this.bookService.getCover(bookId).then(async (book: Book) => {
        this.bookService.book = book;
        this.book = book;
        this.comments = await this.bookService.getComments();
      }).catch(() => {
        this.navCtrl.navigateRoot('/');
      });
    }
    this.loading = false;
    this.getBanner();
    // if (this.bookService.curBookId !== bookId) {
    //   this.bookService.curBookId = this.curBookId;
    //   this.verso = this.bookService.book.verso.length > 0;
    //   this.loading = false;
    //   this.commentService.syncComments(this.bookService.book.id);
    //   this.getBanner();
    //   if (this.authService.connected) {
    //     this.inList = this.userService.haveFromList(this.bookService.book.id);
    //     this.haveCommentedSub = this.commentService.haveCommented(this.bookService.book.id).subscribe((value) => {
    //       if (value.length !== 0) {
    //         const comment: any = value[0].payload.doc.data();
    //         this.comment = comment;
    //         this.commented = true;
    //         this.lastRate = this.comment.rate;
    //       }
    //     });
    //   }
    // } else {
    //   this.loading = false;
    // }
  }

  async answer(userId) {
    const alert = await this.alertController.create({
      header: this.COVER.answer,
      inputs: [
        {
          name: 'answer',
          id: 'answer',
          type: 'textarea',
          placeholder: this.COVER.alertAnswerPlaceholder
        },
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: this.COMMON.send,
          handler: (data) => {
            // this.commentService.answerToComment(this.bookService.book.id, userId, data.answer);
          }
        }
      ]
    });
    await alert.present();
  }

  // async more() {
  //   const alert = await this.alertController.create({
  //     header: this.COVER.changeVerso,
  //     message: this.bookService.book.verso,
  //     buttons: [this.COMMON.ok]
  //   });

  //   await alert.present();
  // }

  changeCat(cat) {
    this.book.category = cat;
    this.bookService.saveBook();
  }

  play() {
    this.bookService.play();
  }

  edit() {
    this.bookService.openBook(this.bookService.book.id);
  }

  back() {
    // this.commentService.unsyncComments();
    // if (this.haveCommentedSub) {
    //   if (!this.haveCommentedSub.closed) {
    //     this.haveCommentedSub.unsubscribe();
    //   }
    // }
    this.bookService.curBookId = '';
  }

  share() {
    this.bookService.shareBook(this.book.id);
  }

  async addTag() {
    if (this.bookService.book.tags.length < 5) {
      const alert = await this.alertController.create({
        header: this.COVER.addTag,
        inputs: [
          {
            name: 'tag',
            type: 'text',
            placeholder: this.COVER.alertTagPlaceholder,
          }
        ],
        buttons: [
          {
            text: this.COMMON.cancel,
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: this.COMMON.confirm,
            handler: (data) => {
              const tags = this.bookService.book.tags;
              const tag: string = data.tag;
              tags.push(tag.toLowerCase());
              this.bookService.book.tags = tags;
              this.bookService.saveBook();
            }
          }
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        message: this.ERRORS.TagsMax,
        buttons: [this.COMMON.ok]
      });
      await alert.present();
    }
  }

  removeTag(index) {
    const tags = this.bookService.book.tags;
    tags.splice(index, 1);
    this.bookService.book.tags = tags;
    this.bookService.saveBook();
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

  // send() {
  //   const date: number = Date.now();
  //   this.comment.date = date;
  //   if (this.comment.rate !== 0 ) {
  //     this.commentService.addComment(this.comment, this.bookService.book.id, this.commented, this.lastRate);
  //     this.toast(this.ERRORS.toastCommentSent);
  //   } else {
  //     this.toast(this.ERRORS.unratedComment);
  //   }
  // }

  addToList() {
    this.userService.addBookListRef(this.bookService.book.id);
    this.toast(this.ERRORS.toastAddedToList);
    this.inList = true;
  }

  removeFromList() {
    this.userService.deleteBookListRef(this.bookService.book.id);
    this.toast(this.ERRORS.toastRemovedFromList);
    this.inList = false;
  }

  async toast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  // enter(keyCode) {
  //   if (keyCode === 13) {
  //     this.send();
  //   }
  // }

  onClick() {}

  showAnswer(index) {
    this.selectedAnswer = index;
  }

  hideAnswer() {
    this.selectedAnswer = -1;
  }

  async changeTitle(value: string) {
    if (value.length > 3 && value.length <= 30) {
      this.bookService.book.title = value;
      this.bookService.saveBook();
    }
    // const alert = await this.alertController.create({
    //   header: this.COVER.alertTitleHeader,
    //   inputs: [
    //     {
    //       name: 'title',
    //       type: 'text',
    //       placeholder: this.COVER.alertTitlePlaceholder,
    //       value: this.bookService.book.title,
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: this.COMMON.cancel,
    //       role: 'cancel',
    //       cssClass: 'secondary'
    //     }, {
    //       text: this.COMMON.confirm,
    //       handler: (data) => {
    //         const title: string = data.title;
    //         if (title.length < 3) {
    //           this.popupService.alert(this.ERRORS.title3CarMin);
    //           return;
    //         } else if (title.length > 40) {
    //           this.popupService.alert(this.ERRORS.title40CarMax);
    //           return;
    //         }
    //         this.bookService.book.title = title;
    //         this.bookService.book.titleLower = title.toLowerCase();
    //         this.bookService.saveBook();
    //       }
    //     }
    //   ]
    // });
    // await alert.present();
  }

  async changeDesc(value: string) {
    if (value.length <= 300) {
      this.bookService.book.description = value;
      this.bookService.saveBook();
    }
    // const alert = await this.alertController.create({
    //   header: this.COVER.changeDesc,
    //   inputs: [
    //     {
    //       name: 'desc',
    //       type: 'text',
    //       placeholder: this.COVER.alertDescPlaceholder,
    //       value: this.bookService.book.description,
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: this.COMMON.cancel,
    //       role: 'cancel',
    //       cssClass: 'secondary'
    //     }, {
    //       text: this.COMMON.confirm,
    //       handler: (data) => {
    //       }
    //     }
    //   ]
    // });
    // await alert.present();
  }

  color() {
    this.popupService.selectColor().then((color) => {
      this.book.color = color;
      this.bookService.saveBook();
    });
  }

  // async changeVerso() {
  //   const alert = await this.alertController.create({
  //     header: this.COVER.changeVerso,
  //     inputs: [
  //       {
  //         name: 'verso',
  //         type: 'textarea',
  //         placeholder: this.COVER.alertVersoPlaceholder,
  //         value: this.bookService.book.verso,
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: this.COMMON.cancel,
  //         role: 'cancel',
  //         cssClass: 'secondary'
  //       }, {
  //         text: this.COMMON.confirm,
  //         handler: (data) => {
  //           this.bookService.updateBookData({verso: data.verso});
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

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
            this.bookService.uploadCoverImg(data.data);
          }
      });
      return await modal.present();
    }
  }

  async changeBanner() {
    if (this.bookService.isAuthor) {
      const modal = await this.modalController.create({
        component: UploadComponent,
        componentProps: {
          type: 'banner',
        }
      });
      modal.onDidDismiss()
        .then(async (data) => {
          if (data.data) {
            await this.bookService.uploadBanner(data.data);
            this.getBanner();
          }
      });
      return await modal.present();
    }
  }

  getBanner() {
    const banner = this.bookService.book.banner;
    if (banner) {
      const res = 'url(' + banner + ')';
      this.background = res;
    }
  }

  report() {
    this.userService.report('book', this.book.id);
  }
}
