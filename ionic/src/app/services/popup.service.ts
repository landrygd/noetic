import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class PopupService {

  loader: HTMLIonLoadingElement;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
    ) { }

  async toast(msg: string, pos = 'bottom') {
    if (pos === 'bottom') {
      const toast = await this.toastController.create({
        message: msg,
        position: 'bottom',
        duration: 2000
      });
      toast.present();
    }
    if (pos === 'middle') {
      const toast = await this.toastController.create({
        message: msg,
        cssClass: 'ion-text-center',
        position: 'middle',
        duration: 1000
      });
      toast.present();
    }
  }

  async alert(msg: string) {
    const alert = await this.alertController.create({
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async alertObj(obj: any) {
    const alert = await this.alertController.create(obj);
    await alert.present();
  }

  async loading(msg = 'Chargement...', id = 'unknowed') {
    this.loader = await this.loadingController.create({
      id,
      message: msg,
      spinner: 'bubbles'
    });
    this.loader.present();
  }

  loadingDismiss(id = 'unknowed') {
    this.loadingController.dismiss(null, null, id);
  }

  async error(err: string) {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: err,
      buttons: ['Mince...']
    });
    await alert.present();
  }
}
