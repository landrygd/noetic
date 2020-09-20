import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ModalController, ToastController, NavController } from '@ionic/angular';
import { SearchUserComponent } from 'src/app/components/modals/search-user/search-user.component';
import { BookService } from 'src/app/services/book.service';
import { WallpapersSearchComponent } from 'src/app/components/modals/wallpapers-search/wallpapers-search.component';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-book',
  templateUrl: './settings-book.page.html',
  styleUrls: ['./settings-book.page.scss'],
})
export class SettingsBookPage implements OnInit, OnDestroy {

  BOOKSETTINGS: any;
  COMMON: any;
  settingsBookSub: Subscription;
  commonSub: Subscription;

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    public bookService: BookService,
    private toastController: ToastController,
    public popupService: PopupService,
    public navController: NavController,
    private userService: UserService,
    private translator: TranslateService
    ) {}

    ngOnInit() {
      this.getTraduction();
    }

    getTraduction() {
      this.settingsBookSub = this.translator.get('BOOKSETTINGS').subscribe((val) => {
        this.BOOKSETTINGS = val;
      });
      this.commonSub = this.translator.get('COMMON').subscribe((val) => {
        this.COMMON = val;
      });
    }

    ngOnDestroy() {
      this.settingsBookSub.unsubscribe();
      this.commonSub.unsubscribe();
    }

  async alertDelete() {
    const alert = await this.alertController.create({
      message: this.BOOKSETTINGS.deleteConfirm,
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.BOOKSETTINGS.delete,
          cssClass: 'danger',
          handler: () => {
            this.bookService.deleteBook();
          }
        }
      ]
    });
    await alert.present();
  }

  async update() {
    const alert = await this.alertController.create({
      message: this.BOOKSETTINGS.updateConfirm,
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.COMMON.update,
          cssClass: 'danger',
          handler: () => {
            this.bookService.uploadBook();
          }
        }
      ]
    });
    await alert.present();
  }

  async alertPublish() {
    const alert = await this.alertController.create({
      message: this.BOOKSETTINGS.publishConfirm,
      inputs: [
        {
          name: 'chart',
          value: 'chart',
          type: 'checkbox',
          label: this.BOOKSETTINGS.policyConfirm,
        },
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.BOOKSETTINGS.seePolicy,
          handler: () => {
            this.navController.navigateForward('chart');
          }
        },
        {
          text: this.BOOKSETTINGS.publish,
          handler: (data) => {
            if (data[0]) {
              this.bookService.publishBook();
            } else {
              this.popupService.alert(this.BOOKSETTINGS.policyError);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async alertUnpublish() {
    const alert = await this.alertController.create({
      message: this.BOOKSETTINGS.stopPublishingConfirm,
      buttons: [
        {
          text: this.COMMON.no,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.COMMON.yes,
          handler: () => {
            this.bookService.unpublishBook();
          }
        }
      ]
    });
    await alert.present();
  }

  delete() {
    this.alertDelete();
  }

  publish() {
    this.alertPublish();
  }

  unpublish() {
    this.alertUnpublish();
  }

  async tuto() {
    await this.userService.addTuto();
    this.toast(this.BOOKSETTINGS.tutoReactivated);
  }

  async invite() {
    const modal = await this.modalController.create({
      component: SearchUserComponent
    });
    modal.onDidDismiss()
      .then((data) => {
        const userId = data.data.userId;
        if (userId !== '') {
          // this.notifService.inviteBook(userId, this.bookService.curBookId);
          this.toast(this.BOOKSETTINGS.invitationSent);
        }
    });
    return await modal.present();
  }

  async toast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  changeMainChat(chatId) {
    this.bookService.book.setup.main = chatId;
    this.bookService.saveBook();
  }
}
