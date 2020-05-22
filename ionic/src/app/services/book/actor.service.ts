import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BookService } from '../book.service';
import { Subscription } from 'rxjs';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { PopupService } from '../popup.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  actors: any[] = [];
  actorsId: string[] = [];

  ownActor: string;
  actorSub: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,
    private bookService: BookService,
    private alertController: AlertController,
    private popupService: PopupService,
    private actionSheetController: ActionSheetController
  ) { }

  addActor(actorName) {
    const id = this.firestore.createId();
    const actor = {
      id,
      name: actorName
    };
    this.firestore.collection('/books').doc(this.bookService.curBookId).collection('actors').doc(actor.id).set(actor);
  }

  async deleteActor(actorId: string) {
    await this.popupService.loading('Suppression...');
    if (this.getAvatarurl(actorId)) {
      this.bookService.deleteMedia(this.getAvatarurl(actorId));
    }
    // On supprime l'acteur
    this.firestore.collection('/books').doc(this.bookService.curBookId).collection('actors').doc(actorId).delete();
    // On supprime tout ses messages
    const chatSub = this.firestore.collection('/books').doc(this.bookService.curBookId).collection('chats').get().subscribe((val) => {
      val.forEach(chat => {
        const logs = [];
        chat.data().logs.forEach(log => {
          if (log.actor !== actorId) {
            logs.push(log);
          }
        });
        if (logs !== chat.data().logs) {
          this.firestore.collection('/books').doc(this.bookService.curBookId).collection('chats').doc(chat.id).update({logs});
        }
      });
      this.popupService.loadingDismiss();
      chatSub.unsubscribe();
    });
  }

  getAvatarurl(actorId: string) {
    return this.bookService.actorsById[actorId].avatar;
  }

  getActors() {
    return this.firestore.collection('/books').doc(this.bookService.curBookId).collection('actors').valueChanges();
  }

  syncActors() {
    this.actorSub = this.firestore.collection('/books').doc(this.bookService.curBookId)
                                  .collection('actors').valueChanges().subscribe((val) => {
      this.actors = val;
      val.forEach((actor) => {
        this.actorsId.push(actor.id);
      });
    });
  }

  async changeActorName(actorId: string) {
    const alert = await this.alertController.create({
      header: 'Changer le pseudo',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Pseudo',
          value: this.bookService.actorsById[actorId].name,
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.updateActorData(actorId, {name: data.name});
          }
        }
      ]
    });
    await alert.present();
  }

  async changeActorBio(actorId: string) {
    const alert = await this.alertController.create({
      header: 'Changer le bio',
      inputs: [
        {
          name: 'bio',
          type: 'text',
          placeholder: 'Bio',
          value: this.bookService.actorsById[actorId].bio,
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.updateActorData(actorId, {bio: data.bio});
          }
        }
      ]
    });
    await alert.present();
  }

  async changeActorColor(actorId: string) {
    const colors =
    ['red', 'pink', 'purple', 'deep-purple', 'indigo',
    'blue', 'light-blue', 'cyan', 'teal', 'green',
    'light-green', 'lime', 'yellow', 'amber', 'orange',
    'deep-orange', 'brown', 'grey', 'blue-grey', 'white', 'black'];
    const buttons = [];
    for (const color of colors) {
      buttons.push({
        text: color,
        cssClass: color,
        handler: () => {
          this.updateActorData(actorId, {color});
        }
      });
    }
    buttons.push({
      text: 'Annuler',
      icon: 'close',
      role: 'cancel',
      handler: () => {}
    });
    const actionSheet = await this.actionSheetController.create({
      buttons
    });
    await actionSheet.present();
  }

  updateActorData(actorId: string, data: any) {
    this.firestore.collection('/books').doc(this.bookService.curBookId).collection('actors').doc(actorId).update(data);
  }

  uploadAvatar(file, actorId) {
    const path = 'books/' + this.bookService.curBookId + '/actors/' + actorId + '/avatar.png';
    this.firestorage.ref(path).putString(file, 'data_url').then( () => {
      this.firestorage.ref(path).getDownloadURL().subscribe((ref) => {
        this.bookService.addMediaRef(ref, path, 'image', 'avatar');
        this.firestore.collection('books').doc(this.bookService.curBookId).collection('actors').doc(actorId).update({avatar: ref});
      });
    }).catch((err) => this.popupService.error(err));
  }

  // getActor(actorId: string) {
  //   for (const actor of this.bookService.actors) {
  //     if (actor.id === actorId) {
  //       return actor;
  //     }
  //   }
  // }

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

  getActorId(actorName: string) {
    actorName.replace('_', ' ');
    for (const actor of this.bookService.actors) {
      if (actor.name.toLowerCase() === actorName.toLowerCase()) {
        return actor.id;
      }
    }
  }

  isOwnActor(actorId: string) {
    return this.ownActor === actorId;
  }

  setOwnActor(actorName: string) {
    this.ownActor = this.getActorId(actorName);
  }

  haveActor(actorId: string): boolean {
    return this.bookService.actorsById.includes(actorId);
  }
}
