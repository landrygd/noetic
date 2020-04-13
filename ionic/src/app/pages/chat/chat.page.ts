import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController, ModalController, IonContent, ActionSheetController, AlertController } from '@ionic/angular';
import { NewActorComponent } from 'src/app/components/modals/new-actor/new-actor.component';
import { NewQuestionComponent } from 'src/app/components/modals/new-question/new-question.component';

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
  actor: string = 'Narrator';
  textarea: boolean = false;

  actions = [
    {
      name: 'label',
      icon: 'bookmark'
    },
    {
      name: 'goto',
      icon: 'arrow-forward'
    },
    {
      name: 'gochat',
      icon: 'chatbubbles'
    }
  ]

  constructor(
    public firebase: FirebaseService, 
    private navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
    ) { 
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
    this.curIndex = -1;
    setTimeout(() => this.scrollToBottom(), 50);
    setTimeout(() => this.text = '', 1);
    this.textarea = false;
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
      this.text = '';
    }
  }

  getClass(index) {
    if(index == this.curIndex) {
      return "selected";
    } else {
      return "notselected";
    }
  }

  enter(keyCode) {
    if (keyCode == 13) {
      this.textarea = true;
      this.send();
    }
  }

  setActor(id) {
    this.actor = id;
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

  async newQuestion(actor: string) {
    const modal = await this.modalCtrl.create({
      component: NewQuestionComponent,
      componentProps: {
        actor: actor
      }
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

  async plus() {
    const actionSheet = await this.actionSheetController.create({
      header: 'More options',
      buttons: [{
        text: 'Question',
        icon: 'help',
        handler: () => {
          this.newQuestion(this.actor);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  newAction(name) {
    if (name == 'goto') {
      this.alertGoto();
    } else if (name == 'gochat') {
      this.alertGochat();
    } else {
      const log = {
        action: name,
      }
      if (name == 'label') {
        log['number'] = this.firebase.getNewLabel();
      }
      this.firebase.addChatLog(log);
      setTimeout(() => this.scrollToBottom(), 50);
    }
    
  }

  async alertGoto() {
    const alert = await this.alertController.create({
      header: 'Goto label',
      message: 'Choose a label number to go to.<br><strong>Be careful, if it does not exist, the jump will be ignored!</strong>',
      inputs: [
        {
          placeholder: 'enter a label number',
          name: 'label',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: (data) => {
            this.newGoto(Number(data.label));
          }
        }
      ]
    });
    await alert.present();
  }

  async alertGochat() {
    const alert = await this.alertController.create({
      header: 'Goto chat',
      message: 'Choose a chat name to go to.<br><strong>Be careful, if it does not exist, the jump will be ignored!</strong>',
      inputs: [
        {
          placeholder: 'enter a chat name',
          name: 'chat',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: (data) => {
            this.newGochat(data.chat);
          }
        }
      ]
    });
    await alert.present();
  }

  newGoto(number: number) {
    const log = {
      action: 'goto',
      number: number
    }
    this.firebase.addChatLog(log);
    setTimeout(() => this.scrollToBottom(), 50);
  }

  newGochat(chat: string) {
    const log = {
      action: 'gochat',
      chat: chat
    }
    this.firebase.addChatLog(log);
    setTimeout(() => this.scrollToBottom(), 50);
  }
}
