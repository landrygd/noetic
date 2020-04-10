import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController, ModalController, IonContent } from '@ionic/angular';
import { NewActorComponent } from 'src/app/components/modals/new-actor/new-actor.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  action: string = 'talk';
  text: string;
  chat = [];
  curIndex = -1;
  avatar = 'assets/avatar/man.png';
  actor: string = 'Narrator';

  actions = [
    {
      name: 'talk',
      icon: 'chatbox'
    },
    {
      name: 'question',
      icon: 'help-circle'
    },
    {
      name: 'label',
      icon: 'bookmark'
    },
    {
      name: 'goto',
      icon: 'navigate'
    },
    {
      name: 'test',
      icon: 'checkmark-circle'
    },
    {
      name: 'audio',
      icon: 'volume-medium'
    },
    {
      name: 'system',
      icon: 'settings'
    }
  ]

  constructor(public firebase: FirebaseService, private navCtrl: NavController, public modalCtrl: ModalController) { 
    this.actor = 'Narrator';
    if (this.firebase.bookActor == undefined) {
      this.navCtrl.navigateRoot("/");
    }
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }

  send() {
    const log = {
      action: 'talk',
      msg: this.text,
      actor: this.actor
    }
    if (this.curIndex == -1) {
      this.firebase.addChatLog(log);
    } else {
      this.firebase.editChatLog(log, this.curIndex);
    }
    this.text = "";
    this.curIndex = -1
    setTimeout(() => this.scrollToBottom(), 50);
  }

  doReorder(event)
  {
    this.curIndex = -1;
    this.chat = this.firebase.chatLogs;
    const itemMove = this.chat.splice(event.detail.from, 1)[0];
    this.chat.splice(event.detail.to, 0, itemMove);
    this.firebase.setChatLogs(this.chat);
    event.detail.complete();
  }

  select(index) {
    if(index !== this.curIndex) {
      this.curIndex = index;
      if (this.firebase.chatLogs[index].action == 'talk') {
        this.text = this.firebase.chatLogs[index].msg;
        this.actor = this.firebase.chatLogs[index].actor;
      }
    } else {
      this.curIndex = -1;
      this.text = "";
    }
  }

  getClass(index) {
    if(index == this.curIndex) {
      return "selected";
    } else {
      return "notselected";
    }
  }

  getClassAction(action) {
    if(action == this.action) {
      return "selected";
    } else {
      return "notselected";
    }
  }

  enter(keyCode) {
    if (keyCode == 13) {
      this.send();
    }
  }

  setActor(id) {
    this.actor = id;
  }

  deleteChat() {
    this.firebase.deleteChat();
  }

  setAction(name) {
    this.action = name;
  }

  async newActor() {
    const modal = await this.modalCtrl.create({
      component: NewActorComponent
    });
    return await modal.present();
  }

  getClassFabActor(actor) {
    if(actor == this.actor) {
      return "selectedfab";
    } else {
      return "notselectedfab";
    }
  }

  play() {
    this.navCtrl.navigateForward("/game");
  }

  isLogSelected(index) {
    if(index == this.curIndex) {
      return true;
    } else {
      return false;
    }
  }
}
