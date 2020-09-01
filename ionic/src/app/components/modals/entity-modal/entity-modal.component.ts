import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UploadComponent } from '../upload/upload.component';
import { Subscription } from 'rxjs';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { ActorService } from 'src/app/services/book/actor.service';
import { BookService } from 'src/app/services/book.service';
import { TranslateService } from '@ngx-translate/core';
import { PlaceService } from 'src/app/services/book/place.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PopupService } from 'src/app/services/popup.service';
import { IdFinderComponent } from '../id-finder/id-finder.component';

@Component({
  selector: 'app-entity-modal',
  templateUrl: './entity-modal.component.html',
  styleUrls: ['./entity-modal.component.scss'],
})
export class EntityModalComponent implements OnInit, OnDestroy {
  @Input() collection: string;
  @Input() id: string;

  ENTITY: any = {};
  PROFILE: any = {};
  COMMON: any = {};
  ERRORS: any = {};

  errorsSub: Subscription;
  entitySub: Subscription;
  profileSub: Subscription;
  commonSub: Subscription;

  actor: any;

  isAuthor = false;

  icon: string;

  entity: {
      id: string,
      name: string,
      desc: string,
      type: string,
      roles: string[],
      key: string,
      color: string,
      pos: string,
      items: string[],
      variables: {
        type: string,
        value: any
      }[],
      actions: any[]
    };
  roles: any;

  items = [];

  constructor(
    private modalController: ModalController,
    private actorService: ActorService,
    public bookService: BookService,
    private alertController: AlertController,
    private translator: TranslateService,
    private actionSheetController: ActionSheetController,
    private firestore: AngularFirestore,
    private popupService: PopupService
    ) {
      this.isAuthor = this.bookService.isAuthor;
    }

  color: string;

  ngOnInit() {
    this.getTraduction();
    this.update();
  }

  getTraduction() {
    this.entitySub = this.translator.get('MODALS.ENTITY').subscribe((val) => {
      this.ENTITY = val;
    });
    this.profileSub = this.translator.get('PROFILE').subscribe((val) => {
      this.PROFILE = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
    this.errorsSub = this.translator.get('ERRORS').subscribe((val) => {
      this.ERRORS = val;
    });
  }

  update() {
    this.entity = this.bookService.entities[this.id];
    this.getColor(this.entity);
    this.items = this.bookService.getEntitiesByValues({pos: this.id});
    this.roles = this.bookService.getRoles(this.entity.roles);
    switch (this.collection) {
      case 'places':
        this.icon = 'location';
        break;
      case 'actors':
        this.icon = 'person';
        break;
      case 'items':
        this.icon = 'cube';
        break;
    }
    console.log(this.roles);
  }

  ngOnDestroy() {
    this.entitySub.unsubscribe();
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
    switch (this.collection) {
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
            switch (this.collection) {
              case 'actors':
                await this.bookService.deleteEntity(this.id, 'actors');
                break;
              case 'items':
                await this.bookService.deleteEntity(this.id, 'items');
                break;
              case 'places':
                await this.bookService.deleteEntity(this.id, 'places');
                break;
              case 'roles':
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

  async showEntity(entityId: string, collection) {
    const modal = await this.modalController.create({
    component: EntityModalComponent,
    componentProps: { id: entityId, collection }
    });
    await modal.present();
    modal.onDidDismiss().then(() => this.update());
  }

  async addVariable(role) {
    const alert = await this.alertController.create({
      header: this.ENTITY.addVariable,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.COMMON.name
        },
        {
          name: 'default',
          type: 'text',
          placeholder: this.COMMON.defaultValue
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
        }, {
          text: this.COMMON.confirm,
          handler: (data) => {
            if (data.name && data.default) {
              const variables = role.variables;
              variables[data.name] = data;
              this.bookService.updateEntity(role.id, 'roles', {variables});
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editVariable(role, variable) {
    const alert = await this.alertController.create({
      header: this.COMMON.edit,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.COMMON.name,
          value: variable.name
        },
        {
          name: 'default',
          type: 'text',
          placeholder: this.COMMON.defaultValue,
          value: variable.default
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
        }, {
          text: this.COMMON.confirm,
          handler: (data) => {
            if (data.name && data.default) {
              const variables: any = role.variables;
              if (data.name !== variable.name) {
                delete variables[variable.name];
                variables[data.name] = {};
              }
              variables[data.name] = data;
              this.bookService.updateEntity(role.id, 'roles', {variables});
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteVariable(role, variable) {
    const Rvariables: any[] = role.variables;
    delete Rvariables[variable.name];
    for (const entityId of Object.keys(this.bookService.entities)) {
      const entity = this.bookService.entities[entityId];
      const variables = entity.variables;
      if (variables) {
        if (variables[variable.name]) {
          delete variables[variable.name];
          this.bookService.updateEntity(entity.id, entity.collection, {variables});
        }
      }
    }
    this.bookService.updateEntity(role.id, 'roles', {variables: Rvariables});
  }

  async addAction(role) {
    const alert = await this.alertController.create({
      header: this.ENTITY.addAction,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.COMMON.name
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
        }, {
          text: this.COMMON.confirm,
          handler: (data) => {
            console.log(role);
            if (data.name) {
              data.chat = '';
              const actions = role.actions;
              actions[data.name] = data;
              this.bookService.updateEntity(role.id, 'roles', {actions});
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editAction(role, action) {
    const alert = await this.alertController.create({
      header: this.COMMON.edit,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.COMMON.name,
          value: action.name
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
        }, {
          text: this.COMMON.confirm,
          handler: (data) => {
            if (data.name) {
              const actions: any = role.actions;
              if (data.name !== action.name) {
                delete actions[action.name];
                actions[data.name] = {};
              }
              actions[data.name] = data;
              this.bookService.updateEntity(role.id, 'roles', {actions});
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteAction(role, action) {
    const actions: any[] = role.actions;
    delete actions[action.name];
    this.bookService.updateEntity(role.id, 'roles', {actions});
  }

  addRole() {
    this.bookService.newEntity('roles', {}, '', this.id, this.collection).then(() => this.update());
  }

  removeRole(roleId) {
    this.bookService.removeRole(roleId).then(() => this.update());
  }

  async editRole(roleId) {
    if (this.entity.key !== roleId) {
      const actionSheet = await this.actionSheetController.create({
        header: this.COMMON.edit,
        buttons: [{
          text: this.COMMON.delete,
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.removeRole(roleId);
          }
        }, {
          text: this.COMMON.cancel,
          icon: 'close',
          role: 'cancel'
        }]
      });
      await actionSheet.present();
    } else {
      this.popupService.toast(this.ERRORS.keyUneditable);
    }
  }

  changeVariable(varName, varValue) {
    const variables = this.bookService.entities[this.id].variables;
    variables[varName] = varValue;
    this.bookService.updateEntity(this.id, this.collection, {variables});
  }

  async changeChat(roleId, actionName) {
    const modal = await this.modalController.create({
    component: IdFinderComponent,
    componentProps: { collection  : 'chats' }
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data.id) {
        const actions = this.bookService.entities[roleId].actions;
        actions[actionName].chat = data.data.id;
        this.bookService.updateEntity(roleId, 'roles', {actions});
      }
    });
    await modal.present();
  }

  async addPlace() {
    const modal = await this.modalController.create({
    component: IdFinderComponent,
    componentProps: { collection  : 'places', exclude : [this.id] }
    });

    modal.onDidDismiss().then((data: any) => {
      const place = data.data.id;
      if (place) {
        let places: string[] = this.bookService.entities[this.id].places;
        if (!places) {
          places = [];
        }
        if (!places.includes(place)) {
          places.push(place);
        }
        this.bookService.updateEntity(this.id, 'places', {places});

        places = this.bookService.entities[place].places;
        if (!places) {
          places = [];
        }
        if (!places.includes(this.id)) {
          places.push(this.id);
        }
        this.bookService.updateEntity(place, 'places', {places});
      }
    });
    await modal.present();
  }

  deletePlace(placeId: string) {
    const places: string[] = this.bookService.entities[this.id].places;
    for (let i = 0; i < places.length; i++) {
      const id = places[i];
      if (id === placeId) {
        places.splice(i, 1);
        break;
      }
    }
    this.bookService.updateEntity(this.id, 'places', {places});

    const places2: string[] = this.bookService.entities[placeId].places;
    for (let i = 0; i < places.length; i++) {
      const id = places[i];
      if (id === this.id) {
        places.splice(i, 1);
        break;
      }
    }
    this.bookService.updateEntity(placeId, 'places', {places});
  }
}
