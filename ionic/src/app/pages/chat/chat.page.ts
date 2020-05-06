import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController, ModalController, IonContent, ActionSheetController, AlertController } from '@ionic/angular';
import { NewActorComponent } from 'src/app/components/modals/new-actor/new-actor.component';
import { NewQuestionComponent } from 'src/app/components/modals/new-question/new-question.component';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  text: string;
  chat = [];
  curIndex = -1;
  avatar = 'assets/avatar/man.png';
  actor: string;
  textarea = false;

  constructor(
    public firebase: FirebaseService,
    public chatService: ChatService,
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
    ) {
    if (this.firebase.bookActor === undefined) {
      this.navCtrl.navigateRoot('/');
    }
  }

  ngOnInit() {
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
    if (this.curIndex === -1) {
      this.firebase.addChatLog(log);
    } else {
      this.firebase.editChatLog(log, this.curIndex);
    }
    this.curIndex = -1;
    setTimeout(() => this.scrollToBottom(), 50);
    setTimeout(() => this.text = '', 1);
    this.textarea = false;
  }

  doReorder(event) {
    this.curIndex = -1;
    this.chat = this.firebase.chatLogs;
    const itemMove = this.chat.splice(event.detail.from, 1)[0];
    this.chat.splice(event.detail.to, 0, itemMove);
    this.firebase.setChatLogs(this.chat);
    event.detail.complete();
  }

  select(index) {
    if (index !== this.curIndex) {
      this.curIndex = index;
      this.text = this.firebase.chatLogs[index].msg;
      if (this.firebase.chatLogs[index].actor) {
        this.actor = this.firebase.chatLogs[index].actor;
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
    this.firebase.deleteChat();
  }

  async newActor() {
    const modal = await this.modalCtrl.create({
      component: NewActorComponent
    });
    return await modal.present();
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
    this.firebase.play(this.firebase.curBookId, this.firebase.curChat, true);
  }

  action(name) {
    this.firebase.toast('impossible d\'executer les boutons ici');
  }
}
