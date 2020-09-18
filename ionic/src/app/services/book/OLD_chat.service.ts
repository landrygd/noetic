import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Observable } from 'rxjs';
import { BookService } from '../book.service';
import { PopupService } from '../popup.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {

  curChatId: string;
  chatLogsSub: Subscription;
  chat: any = {};
  chatLogs: {msg: string, actor: string, number: number, action: string}[] = [];
  tabs: any[] = [];
  lastClosed = 0;

  CHAT: any;
  COMMON: any;
  chatTradSub: Subscription;
  commonSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private bookService: BookService,
    private firestore: AngularFirestore,
    private popupService: PopupService,
    private alertController: AlertController,
    private translator: TranslateService
  ) {
    this.getTraduction();
  }

  getTraduction() {
    this.chatTradSub = this.translator.get('SERVICES.CHAT').subscribe((val) => {
      this.CHAT = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.chatTradSub.unsubscribe();
    this.commonSub.unsubscribe();
  }

  syncChat(chatId) {
    this.curChatId = chatId;
    this.chatLogsSub = this.firestore.collection('books').doc(this.bookService.curBookId)
                                     .collection('chats').doc(chatId).valueChanges().subscribe((value: {logs: any[]}) => {
      if (value !== undefined) {
        this.chat = value;
        this.chatLogs = value.logs.slice();
        this. getTabs();
      } else {
        this.chatLogsSub.unsubscribe();
      }
    });
  }

  getTabs() {
    let cpt = 0;
    this.tabs = [];
    let before = 0;
    for (const log of this.chatLogs) {
      if (before > 0) {
        cpt += before;
        before -= 1;
      }
      if (['/question', '/if'].includes(this.getCommand(log.msg))) {
        if (cpt < 5) {
          before += 1;
        }
      }
      if (this.getCommand(log.msg) === '/end') {
        if (cpt > 0) {
          cpt -= 1;
        }
      }
      this.tabs.push(new Array(cpt));
    }
    this.lastClosed = this.chatLogs.length;
    if (cpt > 0) {
      // before = 0;
      for (let i = this.chatLogs.length - 1; i >= 0; i--) {
        const log = this.chatLogs[i];
        // if (before < 0) {
        //   cpt += before;
        //   before += 1;
        // }
        if (['/question', '/if'].includes(this.getCommand(log.msg))) {
          cpt -= 1;
        }
        if (this.getCommand(log.msg) === '/end') {
          cpt += 1;
        }
        if (cpt <= 0) {
          this.lastClosed = i;
          break;
        }
      }
    }
  }

  getCommand(msg: string) {
    return msg.split(' ')[0];
  }

  unsyncChat() {
    this.chatLogsSub.unsubscribe();
  }

  editChatLog(log, index = this.chatLogs.length) {
    const res = this.chatLogs;
    res.splice(index, 1, log);
    this.setChatLogs(res);
  }

  addChatLog(log, index = this.chatLogs.length) {
    if (log.msg.length > 800) {
      this.popupService.alert(this.CHAT.logMaxError);
      return;
    }
    const res = this.chatLogs;
    res.splice(index, 0, log);
    this.setChatLogs(res);
  }

  deleteChatLog(index = this.chatLogs.length) {
    const res = this.chatLogs;
    res.splice(index, 1);
    this.setChatLogs(res);
  }

  deleteChat(chatId = this.curChatId) {
    if (chatId !== 'main' ) {
      this.unsyncChat();
      this.firestore.collection('books').doc(this.bookService.curBookId).collection('chats').doc(chatId).delete();
      this.navCtrl.navigateRoot('/tabs-book');
    }
  }

  async renameChat() {
    const alert = await this.alertController.create({
      header: this.CHAT.changeChatName,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.CHAT.newChatName,
          value: this.chat.name,
        }
      ],
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.COMMON.ok,
          handler: (data) => {
            this.firestore.collection('books').doc(this.bookService.curBookId)
                          .collection('chats').doc(this.curChatId).update({name: data.name});
          }
        }
      ]
    });
    await alert.present();
  }

  setChatLogs(logs) {
    if (logs > 1000) {
      this.popupService.alert(
        this.CHAT.chatLogsMaxError
        );
      return;
    }
    this.firestore.collection('books').doc(this.bookService.curBookId).collection('chats').doc(this.curChatId).update({logs});
  }

  getLog(line: number) {
    return this.chatLogs[line];
  }

  getLabels(): any[] {
    const res = [];
    this.chatLogs.forEach(element => {
      if (element.action === 'label') {
        res.push(element.number);
      }
    });
    return res;
  }

  getNewLabel(): number {
    let labels = this.getLabels();
    labels = labels.sort();
    for (let i = 0; i < labels.length; i++) {
      if (labels[i] !== i + 1) {
        return i + 1;
      }
    }
    return labels.length + 1;
  }

  getLabelLine(nb) {
    for (let i = 0; i < this.chatLogs.length; i++) {
      const log = this.chatLogs[i];
      if (log.msg === 'label') {
        if (log.number === nb) {
          return i;
        }
      }
    }
    return -1;
  }

  // getChatIdByName(chatName: string) {
  //   for (const chat of this.bookService.chats) {
  //     if (chat.name === chatName) {
  //       return chat.id;
  //     }
  //   }
  //   return this.chat;
  // }

  // haveChat(chatName: string): boolean {
  //   for (const chat of this.bookService.chats) {
  //     if (chat.name === chatName) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // getChat(chatId: string) {
  //   for (const chat of this.bookService.chats) {
  //     if (chat.id.toUpperCase() === chatId.toUpperCase()) {
  //       return chat;
  //     }
  //   }
  // }
}
