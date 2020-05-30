import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ModalController, IonContent, ActionSheetController, AlertController, IonTextarea, PopoverController } from '@ionic/angular';
import { ChatService } from 'src/app/services/book/chat.service';
import { PopupService } from 'src/app/services/popup.service';
import { BookService } from 'src/app/services/book.service';
import { ActorService } from 'src/app/services/book/actor.service';
import { SlidesService } from 'src/app/services/slides.service';
import { MediaService } from 'src/app/services/media.service';
import { ManualComponent } from 'src/app/components/modals/manual/manual.component';
import { TutoPopoverComponent } from 'src/app/components/tuto-popover/tuto-popover.component';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('bg', {static: true, read: ElementRef}) bg: ElementRef;
  @ViewChild('chatBar', {static: true, read: IonTextarea}) chatBar: IonTextarea;

  text = '';
  chat = [];
  curIndex = -1;
  avatar = 'assets/avatar/man.png';
  actor: string;
  textarea = false;
  autoScroll = true;
  loaded = false;

  sound = false;
  music = false;
  ambiance = false;

  tuto = [
    {
      target: 'chatBar',
      info: 'Bienvenue sur l\'éditeur de Noetic, pour passer ce tutoriel, appuyez sur annuler'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Pour ajouter un message, il faut entrer du texte sur la bar de chat puis appuyer sur le bouton "envoyer" en bas à droite de l\'écran'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Pour ajouter un personnage, il faut appuyer sur une bouton "+" en bas à gauche de l\'écran'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Pour faire parler un personnage, il faut appuyer sur son avatar pour le sélectionner dans la barre des personnages'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Vous pouvez déselectionner un personnage en rappuyant sur son avatar. Sans personnage selectionné, vous êtes en mode narrateur.'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Une fois les messages ajoutés, vous pouvez les réordonner en les faisant glisser avec les barres horizontales à leur droite'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Pour supprimer un message ou modifier, il faut le sélectionner en appuyant sur lui puis le réappuyer pour le déselectionner'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Vous pourrez tester votre histoire en appuyant sur le bouton "play" en haut à droite de l\'écran'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Pour éditer ou supprimer un acteur, il faut appuyer sur son avatar dans la barre de chat ou directement sur le chat'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Pour rendre votre histoire dynamique, vous pouvez également entrer une commande en vous référant au manuel en bas à gauche'
    },
    {
      target: 'chatBar',
      // tslint:disable-next-line: max-line-length
      info: 'Ce tutoriel est terminé, bonne découverte!'
    }
  ];

  ERRORS: any = {};
  COMMON: any = {};

  errorSub: Subscription;
  commonSub: Subscription;

  constructor(
    public chatService: ChatService,
    public bookService: BookService,
    public actorService: ActorService,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public popup: PopupService,
    public slides: SlidesService,
    public mediaService: MediaService,
    private popoverController: PopoverController,
    private userService: UserService,
    private translator: TranslateService
    ) {}

  async ngOnInit() {
    this.chatService.syncChat(this.bookService.curChatId);
    this.loaded = true;
    this.getWallpaper();
    setTimeout(() => this.scrollToBottom(), 200);
    this.getTraduction();
  }

  getTraduction() {
    this.errorSub = this.translator.get('ERRORS').subscribe((val) => {
      this.ERRORS = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
    this.commonSub.unsubscribe();
  }

  getWallpaper() {
    if (this.bookService.book.wallpaper) {
      const wallpaper = this.bookService.book.wallpaper;
      if (wallpaper !== '' && wallpaper.substring(0, 4) !== 'http') {
        const res = 'url(' + this.mediaService.getWallpaperURL(wallpaper) + ')';
        this.bg.nativeElement.style.setProperty('--background', res + ' no-repeat center center / cover');
      }
    }
  }

  ngAfterViewInit() {
    if (this.userService.haveTuto()) {
      setTimeout(() => {this.showTuto(); }, 500);
    }
    this.scrollToBottom();
  }

  scrollToBottom(autoScroll = false) {
    if (autoScroll) {
      this.autoScroll = true;
    }
    if (this.autoScroll) {
      setTimeout(() => {
        this.content.scrollToBottom(0);
        }, 200);
    }
  }

  async onScroll() {
    this.content.getScrollElement().then((scroll) => {
      if (scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight > 200) {
        this.autoScroll = false;
      } else {
        this.autoScroll = true;
      }
    });
  }

  send() {
    const log: any = {
      msg: this.text,
    };
    if (this.actor && log.msg.charAt(0) !== '/') {
      log.actor = this.actor;
    }
    if ((log.msg.substring(0, 7).toLowerCase() === '/l main' || log.msg.substring(0, 11).toLowerCase() === '/label main')) {
      this.popup.alert(this.ERRORS.invalidLabelName);
    } else {
      if (this.curIndex === -1) {
        this.chatService.addChatLog(log);
      } else {
        this.chatService.editChatLog(log, this.curIndex);
      }
    }
    setTimeout(() => this.scrollToBottom(), 50);
    setTimeout(() => this.text = '', 1);
    this.curIndex = -1;
    this.textarea = false;
  }

  doReorder(event) {
    this.curIndex = -1;
    this.chat = this.chatService.chatLogs;
    const itemMove = this.chat.splice(event.detail.from, 1)[0];
    this.chat.splice(event.detail.to, 0, itemMove);
    this.chatService.setChatLogs(this.chat);
    event.detail.complete();
  }

  select(index) {
    if (index !== this.curIndex) {
      this.curIndex = index;
      this.text = this.chatService.chatLogs[index].msg;
      if (this.chatService.chatLogs[index].actor) {
        this.actor = this.chatService.chatLogs[index].actor;
      }
    } else {
      this.curIndex = -1;
      this.text = '';
    }
  }

  getClass(index) {
    if (index === this.curIndex) {
      return 'selected';
    } else {
      return 'notselected';
    }
  }

  enter(keyCode) {
    if (keyCode === 13) {
      this.textarea = true;
      this.send();
    }
  }

  setActor(id) {
    if (id === this.actor) {
      this.actor = undefined;
    } else {
      this.actor = id;
    }
  }

  deleteChat() {
    this.chatService.deleteChat();
  }

  newActor() {
    this.actorService.newActor();
  }

  getClassFabActor(actor) {
    if (actor === this.actor) {
      return 'selectedfab';
    } else {
      return 'notselectedfab';
    }
  }

  isLogSelected(index) {
    if (index === this.curIndex) {
      return true;
    } else {
      return false;
    }
  }

  debug() {
    this.bookService.play(this.bookService.curBookId, this.chatService.curChatId, true);
  }

  action(name) {
    this.popup.toast(this.ERRORS.buttonsNotAvaible);
  }

  renameChat() {
    this.chatService.renameChat();
  }

  async settings() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Paramètres',
      buttons: [{
        text: this.COMMON.delete,
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deleteChat();
        }
      }, {
        text: this.COMMON.rename,
        icon: 'create',
        handler: () => {
          this.renameChat();
        }
      }, {
        text: this.COMMON.cancel,
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async manual(type = '') {
    const modal = await this.modalCtrl.create({
    component: ManualComponent,
    componentProps: {type}
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.data) {
      this.text = data.data.command;
    }
  }



  async showTuto(index = 0) {
    const tuto = this.tuto[index];
    let event: CustomEvent<any>;
    if (tuto.target === 'chatBar') {
      const sub = this.chatBar.ionFocus.subscribe((ev) => {
        event = ev;
        sub.unsubscribe();
        this.presentPopover(event, index);
      });
      setTimeout(() => {this.chatBar.setFocus(); }, 500);
    }
  }

  async presentPopover(ev: CustomEvent<any>, index) {
    const end = index >= this.tuto.length - 1;
    const popover = await this.popoverController.create({
      component: TutoPopoverComponent,
      componentProps: {
        info: this.tuto[index].info,
        end
      },
      event: ev,
      translucent: false
    });
    await popover.present();
    const res = await popover.onDidDismiss();
    if (!res.data.hasOwnProperty('cancel')) {
      this.showTuto(index + 1);
    } else {
      this.userService.deleteTuto();
      const alert = await this.alertController.create({
        message: 'Vous pouvez toujours revoir ce tutoriel en le réactivant dans les paramètres du livre',
        buttons: ['Ok']
      });
      await alert.present();
    }
  }

  changeMsg() {
    setTimeout(() => {
      const command = this.text.split(' ')[0];
      this.sound = false;
      this.music = false;
      this.ambiance = false;
      if (command === '/sound') {
        this.sound = true;
      } else if (command === '/music') {
        this.music = true;
      } else if (command === '/ambiance') {
        this.ambiance = true;
      }
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }, 100);
  }

  showAudio(type: string) {
    this.manual(type);
  }
}
