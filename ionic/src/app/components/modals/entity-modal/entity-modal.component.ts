import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { BookService } from 'src/app/services/book.service';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/services/popup.service';
import { IdFinderComponent } from '../id-finder/id-finder.component';
import { UploadComponent } from '../upload/upload.component';
import { Entity } from 'src/app/classes/book';

@Component({
  selector: 'app-entity-modal',
  templateUrl: './entity-modal.component.html',
  styleUrls: ['./entity-modal.component.scss'],
})
export class EntityModalComponent implements OnInit, OnDestroy {
  @Input() entity: Entity;

  ENTITY: any = {};
  PROFILE: any = {};
  COMMON: any = {};
  ERRORS: any = {};

  background = 'url("../../../../assets/banner.png")';

  errorsSub: Subscription;
  entitySub: Subscription;
  profileSub: Subscription;
  commonSub: Subscription;

  actor: any;

  isAuthor = false;

  icon: string;
  roles: any;

  items: string[] = [];

  constructor(
    private modalController: ModalController,
    public bookService: BookService,
    private alertController: AlertController,
    private translator: TranslateService,
    private actionSheetController: ActionSheetController,
    private popupService: PopupService
    ) {
      this.isAuthor = this.bookService.isAuthor;
    }

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
    if (this.entity.banner !== '') {
      this.updateBanner();
    }
    if (this.entity.extra.items) {
      this.items = this.entity.extra.items;
    }
    this.roles = this.bookService.book.getEntities(this.entity.roles, 'key');
    switch (this.entity.type) {
      case 'place':
        this.icon = 'location';
        break;
      case 'actor':
        this.icon = 'person';
        break;
      case 'item':
        this.icon = 'cube';
        break;
    }
  }

  updateBanner() {
    this.background = 'url(' + this.entity.banner + ')';
  }

  ngOnDestroy() {
    this.entitySub.unsubscribe();
    this.profileSub.unsubscribe();
    this.commonSub.unsubscribe();
  }


  async changeName() {
    const alert = await this.alertController.create({
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.COMMON.name,
          value: this.entity.name
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
              this.entity.name = data.name;
              this.saveEntity();
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async changeDesc() {
    const alert = await this.alertController.create({
      inputs: [
        {
          name: 'description',
          type: 'text',
          placeholder: this.COMMON.desc,
          value: this.entity.description
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
        }, {
          text: this.COMMON.confirm,
          handler: (data) => {
            if (data.description) {
              this.entity.description = data.description;
              this.saveEntity();
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async dismiss() {
    return await this.modalController.dismiss();
  }

  async changeAvatar() {
    const modal = await this.modalController.create({
      component: UploadComponent,
      componentProps: {
        type: 'avatar'
      }
    });
    await modal.present();
    modal.onDidDismiss().then((data: any) => {
      const file = data.data;
      this.bookService.uploadEntityImg(file, 'img', this.entity);
    });
  }

  async changeBanner() {
    const modal = await this.modalController.create({
      component: UploadComponent,
      componentProps: {
        type: 'banner'
      }
    });
    await modal.present();
    modal.onDidDismiss().then(async (data: any) => {
      const file = data.data;
      await this.bookService.uploadEntityImg(file, 'banner', this.entity);
      this.updateBanner();
    });
  }

  changeColor() {
    this.popupService.selectColor().then((color) => {
      this.entity.color = color;
      this.saveEntity();
    });
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
            await this.bookService.deleteEntity(this.entity);
            await this.bookService.saveBook();
            this.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  // getColor(actor) {
  //   if (actor.color) {
  //     let color = actor.color;
  //     if (color === 'light') {
  //       color = 'dark';
  //     }
  //     this.color = color;
  //   } else {
  //     this.color = 'dark';
  //   }
  // }

  saveEntity() {
    this.bookService.book.setEntity(this.entity);
    this.bookService.saveBook();
    this.update();
  }

  async addItem() {
    const itemKey = await this.bookService.newEntity('item', {pos: this.entity.key});
    this.entity.addExtra('items', itemKey);
    console.log(this.entity);
    this.update();
  }

  async showEntity(entityId: string, collection) {
    const modal = await this.modalController.create({
    component: EntityModalComponent,
    componentProps: { id: entityId, collection }
    });
    await modal.present();
    modal.onDidDismiss().then(() => this.update());
  }

  async editVariable(role: Entity, variable) {
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
              role.setVariable(data);
              this.bookService.book.setEntity(role);
              this.bookService.saveBook();
              this.update();
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteVariable(role: Entity, variableName: string) {
    this.bookService.book.entities.forEach((entity) => {
      if (entity.haveVariable(variableName)) {
        entity.deleteVariable(variableName);
        this.bookService.book.setEntity(entity);
      }
    });
    role.deleteVariable(variableName);
    this.bookService.book.setEntity(role);
    this.bookService.saveBook();
    this.update();
  }

  async addVariable(role: Entity) {
    const alert = await this.alertController.create({
      header: this.ENTITY.addVariable,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.COMMON.name
        },
        {
          name: 'value',
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
            if (data.name && data.value) {
              role.addVariable(data);
              this.bookService.book.setEntity(role);
              this.bookService.saveBook();
              this.update();
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async addAction(role: Entity) {
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
          handler: (data: {name: string, value: any}) => {
            if (data.name) {
              data.value = '';
              role.addAction(data);
              this.bookService.book.setEntity(role);
              this.bookService.saveBook();
              this.update();
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editAction(role: Entity, action) {
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
              role.setAction(data);
              this.bookService.book.setEntity(new Entity(role));
              this.bookService.saveBook();
              this.update();
            } else {
              this.popupService.error(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteAction(role: Entity, actionName: string) {
    role.deleteAction(actionName);
    this.bookService.book.setEntity(role);
    this.bookService.saveBook();
    this.update();
  }

  async addRole() {
    await this.bookService.newRole();
    this.update();
  }

  removeRole(roleName) {
    this.bookService.book.deleteEntity(roleName);
    this.update();
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
    this.entity.setVariable({name: varName, value: varValue});
    this.saveEntity();
  }

  async changeScript(role: Entity, action: {name: string, value: string}) {
    const modal = await this.modalController.create({
    component: IdFinderComponent,
    componentProps: { type: 'script' }
    });

    modal.onDidDismiss().then((data: any) => {
      const script = data.data.name;
      if (script) {
        action.value = script;
        role.setAction(action);
        this.bookService.book.setEntity(role);
        this.bookService.saveBook();
        this.update();
      }
    });
    await modal.present();
  }

  async addPlace() {
    const modal = await this.modalController.create({
    component: IdFinderComponent,
    componentProps: { type  : 'place', exclude : [this.entity.key] }
    });

    modal.onDidDismiss().then((data: any) => {
      const placeKey = data.data.id;
      if (placeKey) {
        this.entity.addExtra('places', placeKey);
        this.bookService.book.setEntity(this.entity);
        const targetPlace = this.bookService.book.getEntity(placeKey);
        targetPlace.addExtra('places', this.entity.key);
        this.bookService.book.setEntity(targetPlace);
        this.bookService.saveBook();
        this.update();
      }
    });
    await modal.present();
  }

  deletePlace(placeKey: string) {
    this.entity.deleteExtra('places', placeKey);
    this.bookService.book.setEntity(this.entity);
    const targetPlace = this.bookService.book.getEntity(placeKey);
    targetPlace.deleteExtra('places', this.entity.key);
    this.bookService.book.setEntity(this.entity);
    this.bookService.saveBook();
    this.update();
  }
}
