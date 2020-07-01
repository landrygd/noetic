import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { SlidesService } from 'src/app/services/slides.service';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  curCategory = 'undefined';

  mostVueList: Observable<any>;
  mostRecentList: Observable<any>;
  topRatedList: Observable<any>;

  mostVueBooks: any[];
  topRatedBooks: any[];
  mostRecentBooks: any[];

  userBookList: string[] = [];

  homeSub: Subscription;
  commonSub: Subscription;

  HOME: any = {};
  COMMON: any = {};

  rgpd: any;

  constructor(
    public userService: UserService,
    public bookService: BookService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public slides: SlidesService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController,
    private storage: Storage,
    private translator: TranslateService
    ) {}

  ngOnInit() {
    this.getTraduction();
    this.storage.get('RGPD').then((val) => {
      this.rgpd = val;
    });
  }

  ionViewWillEnter() {
    if (!this.rgpd) {
      this.presentRgpd();
    }
  }

  getTraduction() {
    this.homeSub = this.translator.get('HOME').subscribe((val) => {
      this.HOME = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.homeSub.unsubscribe();
    this.commonSub.unsubscribe();
  }


  ionViewDidEnter() {
    setTimeout(() => this.refresh('', true), 500);
  }

  search() {
    this.navCtrl.navigateForward('book-search');
  }

  async options() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.HOME.about,
          icon: 'information',
          handler: () => {
            actionSheet.dismiss();
            this.about();
          }
        },
        {
          text: this.HOME.share,
          icon: 'share',
          handler: async () => {
            await actionSheet.dismiss();
            this.share();
          }
        },
        {
          text: this.HOME.rate,
          icon: 'star',
          handler: () => {
            actionSheet.dismiss();
            this.rate();
          }
        },
        {
          text: this.HOME.report,
          icon: 'warning',
          handler: () => {
            actionSheet.dismiss();
            this.report();
          }
        },
        {
        text: this.COMMON.cancel,
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async about() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.HOME.policy,
          icon: 'document-text',
          handler: () => {
            this.navCtrl.navigateForward('privacy');
          }
        },
        {
          text: this.HOME.chart,
          icon: 'receipt',
          handler: () => {
            this.navCtrl.navigateForward('chart');
          }
        },
        {
          text: this.HOME.aboutApp,
          icon: 'logo-google-playstore',
          handler: () => {
            window.open('https://play.google.com/store/apps/details?id=com.blockup.noetic', '_blank');
          }
        },
        {
          text: this.HOME.noeticSite,
          icon: 'globe',
          handler: () => {
            window.open('https://noetic.site', '_blank');
          }
        },
        {
          text: this.HOME.aboutBlockup,
          icon: 'business',
          handler: () => {
            window.open('https://blockup.net', '_blank');
          }
        }, {
          text: this.COMMON.cancel,
          icon: 'close',
          role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  share() {
    this.userService.shareApp();
  }

  async rate() {
    window.open('https://play.google.com/store/apps/details?id=com.blockup.noetic', '_blank');
  }

  report() {
    this.userService.report('app');
  }

  refresh(event, noEvent= false) {
    this.topRatedBooks = this.userService.topRatedBooks;
    this.mostVueBooks = this.userService.mostVueBooks;
    this.mostRecentBooks = this.userService.mostRecentBooks;
    if (!noEvent) {
      setTimeout(() => {
        event.target.complete();
      }, 500);
    }
    setTimeout(() => {
      if (this.mostRecentBooks.length === 0) {
        this.refresh('', true);
      }
    }, 100);
  }

  async presentRgpd() {
    const toast = await this.toastController.create({
      animated: true,
      buttons: [
        {
          text: this.COMMON.accept,
          icon: 'checkmark',
          role: 'cancel',
          handler: () => {
            this.storage.set('RGPD', true);
            this.rgpd = true;
          }
        }
      ],
      color: 'primary',
      cssClass: 'rgpd',
      keyboardClose: true,
      message: this.HOME.popupRGPD + ' <a href="https://app.noetic.site/privacy">' + this.COMMON.more + '</a>',
      mode: 'ios',
      position: 'bottom',
    });
    toast.present();
  }
}
