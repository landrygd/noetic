import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, ActionSheetController, IonContent, ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { Animation, AnimationController } from '@ionic/angular';
import { BookService } from 'src/app/services/book.service';
import { ChatService } from 'src/app/services/book/chat.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  id: string;
  sub: Subscription;
  line = -1;
  chat: any;
  chatLogs: any[] = [];
  logs: any[] = [];
  chatId = 'main';
  curHost = '';
  loopMinTime = 1000;
  question = false;
  labels: any;
  exited = false;
  ended = false;
  waitTime = 500;

  avatar = undefined;

  speed = 1000; // CPS

  curLog: any;
  msg: string;
  command: string;
  opts: any[] = [];
  arg: string;

  cptChatLabel: any = {};

  constructor(
    public bookService: BookService,
    public chatService: ChatService,
    public navCtrl: NavController,
    public database: AngularFireDatabase,
    public alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,
    private popupService: PopupService
    ) {
    }

  ngOnInit() {
    this.id = this.bookService.curBookId;
    this.playChat(this.bookService.curChatId);
  }

  playChat(chatName = 'main') {
    this.line = 0;
    this.chatService.getChat(chatName);
    this.chat = this.chatService.getChat(chatName);
    this.chatLogs = this.chat.logs;
    this.labels = this.getLabels();
    this.playLog();
  }

  playLog() {
    if (!this.exited) {
      if (this.line < this.chatLogs.length) {
        let gochat = '';
        let line = this.line + 1;
        let time = 1000;
        this.curLog = this.chatLogs[this.line];
        this.msg = this.curLog.msg;
        if (this.msg.charAt(0) === '/') {
          time = -this.waitTime;
          if (this.msg.charAt(1) !== '/') {
            this.getCommandValues(this.msg);
            switch (this.command) {
              case 'g':
              case 'go':
                if (this.opts.includes('chat')) {
                  if (this.chatService.haveChat(this.arg)) {
                    if (this.checkCptLabel(this.arg)) {
                      gochat = this.arg;
                    }
                  }
                } else {
                  if (this.labels.hasOwnProperty(this.arg)) {
                    if (this.checkCptLabel(this.chat.name, this.arg)) {
                      line = this.labels[this.arg];
                    }
                  }
                }
                break;
              case 'sound':
                // TO DO
                break;
              case 'end':
                line = this.chatLogs.length;
                this.ended = true;
                this.logs.push({msg: '/end'});
                break;
              case 'alert':
                // TO DO
                break;
              case 'music':
                // TO DO
                break;
              default:
            }
          }
        } else {
          this.logs.push(this.curLog);
          time = this.curLog.msg.length * 50;
        }
        if (gochat === '') {
          setTimeout(() => {
            this.line = line;
            this.playLog();
          }, time + this.waitTime);
        } else {
          setTimeout(() => {
            this.playChat(gochat);
          }, time + this.waitTime);
        }
      } else if (!this.ended) {
        setTimeout(() => {
          this.end();
        }, this.waitTime);
      }
    }
  }

  checkCptLabel(chatName = this.chat.name, labelName = 'main') {
    if (this.cptChatLabel.hasOwnProperty(chatName)) {
      if (this.cptChatLabel[chatName].hasOwnProperty(labelName)) {
        this.cptChatLabel[chatName][labelName] += 1;
        const cpt = this.cptChatLabel[chatName][labelName];
        if (cpt >= 9) {
          if (labelName === 'main') {
            if (this.bookService.debug) {
              this.popupService.alert(
                'Un chat ne peut être utilisé que 10 fois maximum! Il sera ignoré pendant la lecture ce quotas dépassé.'
                );
            }
            return false;
          } else {
            if (this.bookService.debug) {
              this.popupService.alert(
                'Un label ne peut être utilisé que 10 fois maximum! Il sera ignoré pendant la lecture ce quotas dépassé.'
                );
            }
            return false;
          }
        }
      } else {
        this.cptChatLabel[chatName] = {[labelName]: 1};
      }
    } else {
      this.cptChatLabel[chatName] = {main: 1};
    }
    return true;
  }

  scrollToBottom() {
    setTimeout(() => {
    this.content.scrollToBottom(400);
    }, 100);
  }

  getCommandValues(str: string) {
    const words: string[] = str.split(' ');
    const firstWord = words.shift();
    this.command = firstWord.slice(1);
    let opt = true;
    this.arg = '';
    for (const word of words) {
      if (word.charAt(0) === '-' && opt) {
        this.opts.push(word.slice(1));
      } else {
        if (opt) {
          opt = false;
          this.arg = word;
        } else {
          this.arg += ' ' + word;
        }
      }
    }
    return;
  }

  getLabels() {
    const res = {};
    for (let i = 0; i < this.chatLogs.length; i++) {
      const log = this.chatLogs[i];
      const command: any[] = log.msg.split(' ');
      const labelCommand = command.shift();
      if (labelCommand === '/label' || labelCommand === '/l') {
        const labelName = command.join(' ');
        res[labelName] = i;
      }
    }
    return res;
  }

  // labelCheck(nb): boolean {
  //   const chat = this.game.chat[this.chatId];
  //   if (chat.hasOwnProperty('time')) {
  //     if (chat.time.hasOwnProperty('label' + nb)) {
  //       const labelTime = new Date(chat.time['label' + nb].time).getTime();
  //       if ((new Date().getTime() - labelTime) < 1000) {
  //         return false;
  //       }
  //     }
  //   }
  //   this.database.object('games/' + this.id + '/chat/' + this.chatId + '/time/label' + nb).set({time: Date().toString()});
  //   return true;
  // }

  answerInit(count) {
    const res = [];
    for (let i = 0; i < count; i++) {
      res.push(0);
    }
    this.database.object('games/' + this.id + '/chat/' + this.bookService.curChatId).update({answers: res});
  }

  send() {

  }

  plus() {

  }

  action(name) {
    switch (name) {
      case 'end':
        this.exit();
    }
  }

  end() {
    this.logs.push(
      {msg: 'Cette histoire est à présent terminée.'}
    );
    setTimeout(() => {
      this.logs.push(
        {msg: 'N\'hésitez pas à laisser un commentaire pour soutenir son/ses créateur(s)!'}
      );
      setTimeout(() => {
        this.logs.push(
          {msg: '/end'}
        );
      }, 3000);
    }, 2000);
  }

  exit() {
    this.exited = true;
    if (!this.bookService.debug) {
      this.bookService.unsyncBook();
    }
    this.navCtrl.back();
  }

  // async alertLoop() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Trop rapide!',
  //     message: 'Pour les raisons de sécurités, les boucles (label/go) infinies et trop rapides sont interdites<br>' +
  //     '<strong>Veuillez verifier que vos labels et go vers labels ne sont pas trop proches!</strong>',
  //     buttons: [
  //       {
  //         text: 'Sortir',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           this.exit();
  //         }
  //       }, {
  //         text: 'Continuer quand même',
  //         handler: () => {
  //           this.line
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  // answer(index) {
  //   const answers = this.game.getAnswersList();
  //   answers.splice(index, 1, answers[index] + 1);
  //   this.database.object('games/' + this.id + '/chat/' + this.game.chatId).update({answers});
  //   this.question = false;
  // }

  // async anwserList() {
  //   const buttons = [];
  //   const answers = this.game.getAnswers();
  //   for (let i = 0; i < answers.length; i++) {
  //     const answer = answers[i];
  //     buttons.push({
  //       text: answer.msg,
  //       handler: () => {
  //         this.answer(i);
  //       }
  //     });
  //   }
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Choose your answer',
  //     buttons,
  //   });
  //   await actionSheet.present();
  // }
}
