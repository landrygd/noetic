import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BookService } from '../book.service';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { PopupService } from '../popup.service';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  actors: any[] = [];

  actorSub: Subscription;

  actorsCollection = this.firestore.collection('/books').doc(this.bookService.curBookId).collection('actors');

  constructor(
    private firestore: AngularFirestore,
    private bookService: BookService,
    private alertController: AlertController,
    private popupService: PopupService
  ) { }

  addActor(actorName) {
    const id = this.firestore.createId();
    const actor = {
      id,
      name: actorName
    };
    this.actorsCollection.doc(actor.id).set(actor);
  }

  getActors() {
    return this.actorsCollection.valueChanges();
  }

  syncActors() {
    this.actorSub = this.actorsCollection.valueChanges().subscribe((val) => {
      this.actors = val;
    });
  }

  getActor(actorId: string) {
    for (const actor of this.bookService.actors) {
      if (actor.id === actorId) {
        return actor;
      }
    }
  }

  async newActor() {
    const alert = await this.alertController.create({
      header: 'Ajouter un acteur',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nom'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Créer',
          handler: (data) => {
            if (data.name) {
              this.addActor(data.name);
            } else {
              this.popupService.toast('Veuillez entrer un nom');
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
