import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { SearchUserComponent } from 'src/app/components/modals/search-user/search-user.component';
import { BookService } from 'src/app/services/book.service';
import { NotifService } from 'src/app/services/user/notif.service';

@Component({
  selector: 'app-settings-book',
  templateUrl: './settings-book.page.html',
  styleUrls: ['./settings-book.page.scss'],
})
export class SettingsBookPage implements OnInit {

  constructor(public modalCtrl: ModalController,
              public alertController: AlertController,
              public bookService: BookService,
              private toastController: ToastController,
              public notifService: NotifService) {}

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
      message: 'Etes vous sûr de rendre ce livre publique?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Oui',
          handler: () => {
            this.bookService.publishBook();
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


  delete() {
    this.alertDelete();
  }

  publish() {
    this.alertPublish();
  }

  unpublish() {
    this.alertUnpublish();
  }

  async invite() {
    const modal = await this.modalCtrl.create({
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
