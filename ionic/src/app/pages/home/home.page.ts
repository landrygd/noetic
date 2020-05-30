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
          text: 'A propos',
          icon: 'information',
          handler: () => {
            actionSheet.dismiss();
            this.about();
          }
        },
        {
          text: 'Partager l\'application',
          icon: 'share',
          handler: async () => {
            await actionSheet.dismiss();
            this.share();
          }
        },
        {
          text: 'Noter l\'application',
          icon: 'star',
          handler: () => {
            actionSheet.dismiss();
            this.rate();
          }
        },
        {
          text: 'Signaler un problème',
          icon: 'warning',
          handler: () => {
            actionSheet.dismiss();
            this.report();
          }
        },
        {
        text: 'Annuler',
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
          text: 'Politique de confidentialité',
          icon: 'document-text',
          handler: () => {
            this.navCtrl.navigateForward('privacy');
          }
        },
        {
          text: 'Charte de Noetic',
          icon: 'receipt',
          handler: () => {
            this.navCtrl.navigateForward('chart');
          }
        },
        {
          text: 'A propos de l\'application',
          icon: 'logo-google-playstore',
          handler: () => {
            window.open('https://play.google.com/store/apps/details?id=com.blockup.noetic', '_blank');
          }
        },
        {
          text: 'Site de Noetic',
          icon: 'globe',
          handler: () => {
            window.open('https://noetic.site', '_blank');
          }
        },
        {
          text: 'A propos de Blockup',
          icon: 'business',
          handler: () => {
            window.open('https://blockup.net', '_blank');
          }
        }, {
          text: 'Annuler',
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
    const alert = await this.alertController.create({
      header: 'Avant de continuer...',
      message: 'L\'équipe vous remercie pour votre engagement. ' +
      'Apporter votre avis sur notre application nous aide à mieux comprendre les besoins de nos utilisateurs. ' +
      'Nous espérons sincèrement que votre expérience sur Noetic vous a plu.',
      buttons: ['Noter l\application']
    });
    await alert.present();
    await alert.onDidDismiss();
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
