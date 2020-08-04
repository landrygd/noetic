import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PopupService implements OnDestroy {

  loader: HTMLIonLoadingElement;
  alerter: HTMLIonAlertElement;

  commonSub: Subscription;
  COMMON: any;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private translator: TranslateService
    ) {
      this.getTraduction();
    }

  getTraduction() {
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.commonSub.unsubscribe();
  }

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

  async loading(msg = 'loading...', id = 'unknowed') {
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
      header: this.COMMON.error,
      message: err,
      buttons: [this.COMMON.ok]
    });
    await alert.present();
    this.loader.dismiss();
  }
}
