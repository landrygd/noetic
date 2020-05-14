import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, ModalController, IonContent, ActionSheetController, AlertController } from '@ionic/angular';
import { ChatService } from 'src/app/services/book/chat.service';
import { PopupService } from 'src/app/services/popup.service';
import { BookService } from 'src/app/services/book.service';
import { ActorService } from 'src/app/services/book/actor.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  text: string;
  chat = [];
  curIndex = -1;
  avatar = 'assets/avatar/man.png';
  actor: string;
  textarea = false;

  loaded = false;

  constructor(
    public chatService: ChatService,
    public bookService: BookService,
    public actorService: ActorService,
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public popup: PopupService
    ) {}

  ngOnInit() {
    if (this.bookService.curChatId === undefined) {
      this.navCtrl.navigateRoot('/');
    } else {
      this.chatService.syncChat(this.bookService.curChatId);
      this.loaded = true;
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }

  send() {
    const log: any = {
      msg: this.text,
    };
    if (this.actor && log.msg.charAt(0) !== '/') {
      log.actor = this.actor;
    }
    if ((log.msg.substring(0, 7).toLowerCase() === '/l main' || log.msg.substring(0, 11).toLowerCase() === '/label main')) {
      this.popup.alert('Impossible de créer de label avec ce nom.');
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

  async plus() {
    const actionSheet = await this.actionSheetController.create({
      header: 'More options',
      buttons: [{
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  debug() {
    this.bookService.play(this.bookService.curBookId, this.chatService.chat.name, true);
  }

  action(name) {
    this.popup.toast('impossible d\'executer les boutons ici');
  }

  renameChat() {
    this.chatService.renameChat();
  }

  async settings() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Paramètres',
      buttons: [{
        text: 'Supprimer',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deleteChat();
        }
      }, {
        text: 'Renommer',
        icon: 'create',
        handler: () => {
          this.renameChat();
        }
      }, {
        text: 'Annuler',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }
}
