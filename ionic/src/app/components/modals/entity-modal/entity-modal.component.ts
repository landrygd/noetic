import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UploadComponent } from '../upload/upload.component';
import { Subscription } from 'rxjs';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { ActorService } from 'src/app/services/book/actor.service';
import { BookService } from 'src/app/services/book.service';
import { TranslateService } from '@ngx-translate/core';
import { PlaceService } from 'src/app/services/book/place.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-entity-modal',
  templateUrl: './entity-modal.component.html',
  styleUrls: ['./entity-modal.component.scss'],
})
export class EntityModalComponent implements OnInit, OnDestroy {
  @Input() type: string;
  @Input() id: string;

  ACTOR: any = {};
  PROFILE: any = {};
  COMMON: any = {};

  actorSub: Subscription;
  profileSub: Subscription;
  commonSub: Subscription;

  actor: any;

  isAuthor = false;

  icon: string;

  collection: string;
  entity: any;

  items = [];

  constructor(
    private modalController: ModalController,
    private actorService: ActorService,
    public bookService: BookService,
    private alertController: AlertController,
    private translator: TranslateService,
    private actionSheetController: ActionSheetController,
    private firestore: AngularFirestore
    ) {
      this.isAuthor = this.bookService.isAuthor;
    }

  color: string;

  ngOnInit() {
    this.getTraduction();
    this.update();
    switch (this.type) {
      case 'actor':
        this.icon = 'person';
        this.collection = 'actors';
        break;
      case 'item':
        this.icon = 'cube';
        this.collection = 'items';
        break;
      case 'place':
        this.icon = 'location';
        this.collection = 'places';
        break;
    }
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

  update() {
    this.entity = this.bookService.entities[this.id];
    this.getColor(this.entity);
    this.items = this.bookService.getEntitiesByValues({pos: this.id});
  }

  ngOnDestroy() {
    this.actorSub.unsubscribe();
    this.profileSub.unsubscribe();
    this.commonSub.unsubscribe();
  }


  changeName() {
    this.bookService.updateFieldEntity(this.id, this.collection, ['name']);
  }

  changeDesc() {
    this.bookService.updateFieldEntity(this.id, this.collection, ['desc']);
  }

  async dismiss() {
    return await this.modalController.dismiss();
  }

  async changeAvatar() {
    let type: string;
    switch (this.type) {
      case 'actor':
        type = 'actorAvatar';
        break;
      case 'item':
        type = 'itemAvatar';
        break;
      case 'place':
        type = 'placeAvatar';
        break;
      case 'role':
        type = 'roleAvatar';
        break;
    }
    const modal = await this.modalController.create({
      component: UploadComponent,
      componentProps: {
        type,
        fileId: this.id
      }
    });
    return await modal.present();
  }

  async changeColor() {
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
          this.bookService.updateEntity(this.id, this.collection, {color}).then(() => this.update());
        }
      });
    }
    buttons.push({
      text: this.COMMON.cancel,
      icon: 'close',
      role: 'cancel',
      handler: () => {}
    });
    const actionSheet = await this.actionSheetController.create({
      buttons,
      mode: 'md'
    });
    await actionSheet.present();
  }

  async delete() {
    const alert = await this.alertController.create({
      header: this.COMMON.warning,
      message: this.COMMON.warningDelete,
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.COMMON.delete,
          handler: async () => {
            switch (this.type) {
              case 'actor':
                await this.actorService.deleteActor(this.id);
                break;
              case 'item':
                await this.bookService.deleteEntity(this.id, 'items');
                break;
              case 'place':
                await this.bookService.deleteEntity(this.id, 'places');
                break;
              case 'role':
                await this.bookService.deleteEntity(this.id, 'roles');
                break;
            }
            await this.dismiss();
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
      this.color = color;
    } else {
      this.color = 'dark';
    }
  }

  addItem() {
    const id = this.firestore.createId();
    this.bookService.newEntity('items', {pos: this.id}, id).then(async () => {
      const items = this.entity.items;
      if (!this.items.includes(id)) {
        items.push(id);
        await this.bookService.updateEntity(this.id, this.collection, {items});
      }
      this.update();
    });
  }

  async showItem(itemId: string) {
    const modal = await this.modalController.create({
    component: EntityModalComponent,
    componentProps: { id: itemId, type: 'item' }
    });
    await modal.present();
    modal.onDidDismiss().then(() => this.update());
  }
}
