import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActorService } from 'src/app/services/book/actor.service';
import { BookService } from 'src/app/services/book.service';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-actor-profile',
  templateUrl: './actor-profile.component.html',
  styleUrls: ['./actor-profile.component.scss'],
})
export class ActorProfileComponent implements OnInit {

  @Input() actorId: string;

  actor: any;

  isAuthor = false;

  constructor(
    private modalController: ModalController,
    private actorService: ActorService,
    public bookService: BookService,
    private alertController: AlertController
    ) {
      this.isAuthor = this.bookService.isAuthor;
    }

  color: string;

  ngOnInit() {}

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
      header: 'Attention',
      message: 'En supprimant cet acteur, vous supprimez également tout ses messages.',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Supprimer',
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
