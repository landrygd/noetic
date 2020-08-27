import { PopupService } from 'src/app/services/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  placeTradSub: Subscription;
  commonSub: Subscription;
  errorSub: Subscription;

  PLACE: any;
  COMMON: any;
  ERRORS: any;

  constructor(
    public translator: TranslateService,
    private alertController: AlertController,
    private popupService: PopupService
    ) {
      this.getTraduction();
    }

  getTraduction() {
    this.placeTradSub = this.translator.get('SERVICES.PLACE').subscribe((val) => {
      this.PLACE = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
    this.errorSub = this.translator.get('ERRORS').subscribe((val) => {
      this.ERRORS = val;
    });
  }

  addActor(id: string, name: string) {

  }

  async newPlace() {
    const alert = await this.alertController.create({
      header: this.PLACE.header,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.COMMON.name,
        },
        {
          name: 'id',
          type: 'text',
          placeholder: this.COMMON.id,
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
            if (data.name && data) {
              this.addActor(data.id, data.name);
            } else {
              this.popupService.toast(this.ERRORS.actorNameError);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
