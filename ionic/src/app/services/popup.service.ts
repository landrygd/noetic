import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class PopupService {

  loader: HTMLIonLoadingElement;
  alerter: HTMLIonAlertElement;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
    ) {}

  async init() {
    this.loader = await this.loadingController.create({});
    this.alerter = await this.alertController.create({});
  }

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
    this.alerter = await this.alertController.create({
      message: msg,
      buttons: ['OK']
    });
    await this.alerter.present();
  }

  async alertObj(obj: any) {
    this.alerter = await this.alertController.create(obj);
    await this.alerter.present();
  }

  async loading(msg = 'Chargement...', id = 'unknowed') {
    this.loader = await this.loadingController.create({
      id,
      message: msg,
      spinner: 'bubbles'
    });
    this.loader.present();
  }

  loadingDismiss(id = 'unknowed'): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.loadingController.dismiss(null, null, id).then(() => resolve()).catch((err) => reject(err));
    });
  }

  async error(err: string) {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: err,
      buttons: ['Mince...']
    });
    await alert.present();
    this.loader.dismiss();
  }
}
