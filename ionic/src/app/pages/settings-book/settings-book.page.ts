import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SearchUserComponent } from 'src/app/components/modals/search-user/search-user.component';

@Component({
  selector: 'app-settings-book',
  templateUrl: './settings-book.page.html',
  styleUrls: ['./settings-book.page.scss'],
})
export class SettingsBookPage implements OnInit {

  constructor(public modalCtrl: ModalController, 
    public alertController: AlertController, 
    public firebase: FirebaseService, 
    private toastController: ToastController) {}

  ngOnInit() {
  }

  async alertDelete() {
    const alert = await this.alertController.create({
      header: 'Delete the book',
      message: 'Are you sure to delete the book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirm',
          handler: () => {
            this.firebase.deleteBook();
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
            this.firebase.publishBook();
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
            this.firebase.unpublishBook();
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
        const userId = data["data"].userId;
        if(userId !== "") {
          this.firebase.inviteBook(userId);
          this.toast('Invitation envoyée.')
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
