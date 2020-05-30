import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActorService } from 'src/app/services/book/actor.service';
import { BookService } from 'src/app/services/book.service';
import { UploadComponent } from '../upload/upload.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-actor-profile',
  templateUrl: './actor-profile.component.html',
  styleUrls: ['./actor-profile.component.scss'],
})
export class ActorProfileComponent implements OnInit, OnDestroy {

  @Input() actorId: string;

  ACTOR: any = {};
  PROFILE: any = {};
  COMMON: any = {};

  actorSub: Subscription;
  profileSub: Subscription;
  commonSub: Subscription;

  actor: any;

  isAuthor = false;

  constructor(
    private modalController: ModalController,
    private actorService: ActorService,
    public bookService: BookService,
    private alertController: AlertController,
    private translator: TranslateService
    ) {
      this.isAuthor = this.bookService.isAuthor;
    }

  color: string;

  ngOnInit() {
    this.getTraduction();
  }

  getTraduction() {
    this.actorSub = this.translator.get('MODALS.ACTOR').subscribe((val) => {
      this.ACTOR = val;
    });
    this.profileSub = this.translator.get('PROFILE').subscribe((val) => {
      this.PROFILE = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.actorSub.unsubscribe();
    this.profileSub.unsubscribe();
    this.commonSub.unsubscribe();
  }


  changeName() {
    this.actorService.changeActorName(this.actorId);
  }

  changeBio() {
    this.actorService.changeActorBio(this.actorId);
  }

  async dismiss() {
    return await this.modalController.dismiss();
  }

  async changeAvatar() {
    const modal = await this.modalController.create({
      component: UploadComponent,
      componentProps: {
        type: 'actorAvatar',
        fileId: this.actorId
      }
    });
    return await modal.present();
  }

  changeColor() {
    this.actorService.changeActorColor(this.actorId);
  }

  async deleteActor() {
    const alert = await this.alertController.create({
      header: this.COMMON.warning,
      message: this.ACTOR.warningDesc,
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.COMMON.delete,
          handler: async () => {
            await this.dismiss();
            this.actorService.deleteActor(this.actorId);
          }
        }
      ]
    });
    await alert.present();
  }

  getColor(actor) {
    if (actor.color) {
      let color = actor.color;
      if (color === 'light') {
        color = 'dark';
      }
      return color;
    } else {
      return 'dark';
    }
  }
}
