import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController, NavController } from '@ionic/angular';
import { SearchUserComponent } from 'src/app/components/modals/search-user/search-user.component';
import { BookService } from 'src/app/services/book.service';
import { NotifService } from 'src/app/services/user/notif.service';
import { WallpapersSearchComponent } from 'src/app/components/modals/wallpapers-search/wallpapers-search.component';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings-book',
  templateUrl: './settings-book.page.html',
  styleUrls: ['./settings-book.page.scss'],
})
export class SettingsBookPage implements OnInit {

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    public bookService: BookService,
    private toastController: ToastController,
    public notifService: NotifService,
    public popupService: PopupService,
    public navController: NavController,
    private userService: UserService
    ) {}

  ngOnInit() {
  }

  async alertDelete() {
    const alert = await this.alertController.create({
      header: 'Supprimer le livre',
      message: 'Etes vous sûr de vouloir supprimer ce livre?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Supprimer ce livre',
          cssClass: 'danger',
          handler: () => {
            this.bookService.deleteBook();
          }
        }
      ]
    });
    await alert.present();
  }

  async alertPublish() {
    const alert = await this.alertController.create({
      header: 'Publier le livre',
      message: 'Etes vous sûr de rendre ce livre publique? Son contenu doit respecter les règles de la charte de Noetic',
      inputs: [
        {
          name: 'chart',
          value: 'chart',
          type: 'checkbox',
          label: 'J\'ai respecté la charte',
        },
      ],
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Voir la charte',
          handler: () => {
            this.navController.navigateForward('chart');
          }
        },
        {
          text: 'Oui',
          handler: (data) => {
            if (data[0]) {
              this.bookService.publishBook();
            } else {
              this.popupService.alert('Vous devez avoir pris conscience des règles de la charte de Noetic');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async alertUnpublish() {
    const alert = await this.alertController.create({
      header: 'Arrêter de publier le livre',
      message: 'Etes vous sûr de rendre ce livre privé?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Oui',
          handler: () => {
            this.bookService.unpublishBook();
          }
        }
      ]
    });
    await alert.present();
  }

  async leave() {
    const alert = await this.alertController.create({
      header: 'Se retirer du livre',
      message: 'Etes vous sûr de vouloir vous retirer des auteurs de ce livre?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Oui',
          handler: () => {
            this.bookService.leaveBook();
          }
        }
      ]
    });
    await alert.present();
  }

  async background() {
    const modal = await this.modalController.create({
    component: WallpapersSearchComponent,
    });
    await modal.present();
    modal.onDidDismiss()
    .then((data) => {
      if (data.data) {
      const wallpaper = data.data.name;
      this.bookService.changeWallpaper(this.bookService.curBookId, wallpaper);
      }
    });
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
    this.toast('Tutoriel réactivé');
  }

  async invite() {
    const modal = await this.modalController.create({
      component: SearchUserComponent
    });
    modal.onDidDismiss()
      .then((data) => {
        const userId = data.data.userId;
        if (userId !== '') {
          this.notifService.inviteBook(userId, this.bookService.curBookId);
          this.toast('Invitation envoyée.');
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
}
