import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, ActionSheetController, IonContent } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book.service';
import { ChatService } from 'src/app/services/book/chat.service';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  bookId: string;
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
  paused = false;
  waitTime = 500;
  input = false;

  avatar = undefined;

  speed = 1000; // CPS

  curLog: any;
  msg: string;
  command: string;
  opts: any[] = [];
  arg: any;
  args: any[];

  answers: string[];

  variables: any = {};

  cptChatLabel: any = {};

  nomVar: any;
  nomVar1: any;
  nomVar2: any;
  varValue: any;
  varValue1: any;
  varValue2: any;

  constructor(
    public bookService: BookService,
    public chatService: ChatService,
    public navCtrl: NavController,
    public database: AngularFireDatabase,
    public alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,
    private popupService: PopupService,
    private userService: UserService,
    private alertController: AlertController
    ) {
    }

  ngOnInit() {
    this.play();
  }

  async play() {
    this.input = false;
    this.question = false;
    this.paused = false;
    this.exited = false;
    this.chatLogs = [];
    this.bookId = this.bookService.curBookId;
    if (this.userService.haveSave(this.bookId)) {
      await this.load();
      console.log(this.chatId, this.line, this.variables);
      this.playChat(this.chatId, this.line);
    } else {
      this.line = 0;
      this.variables = {};
      this.playChat();
    }
  }

  async playChat(chatName = 'main', line = 0) {
    this.line = line;
    this.chatService.getChat(chatName);
    this.chat = this.chatService.getChat(chatName);
    this.chatLogs = this.chat.logs;
    this.labels = this.getLabels();
    this.playLog();
  }

  async playLog() {
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
            this.nomVar = this.getVariableName(this.args[0]);
            this.nomVar1 = this.getVariableName(this.args[1]);
            this.nomVar2 = this.getVariableName(this.args[2]);
            this.varValue = this.toVariable(this.args[0]);
            this.varValue1 = this.toVariable(this.args[1]);
            this.varValue2 = this.toVariable(this.args[2]);
            switch (this.command) {
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
                await this.popupService.alert(this.arg);
                await this.popupService.alerter.onDidDismiss();
                break;
              case 'wait':
                await this.wait(Number(this.arg));
                break;
              case 'music':
                // TO DO
                break;
              case 'input':
                this.paused = true;
                this.input = true;
                break;
              case 'question':
                this.paused = true;
                this.answers = this.arg.split(';');
                this.question = true;
                break;
              case 'if':
                const endVal = this.args.slice(2, this.args.length).join(' ');
                if (['=', '==', '==='].includes(this.varValue1)) {
                  if (this.varValue !== endVal) {
                    line = this.getNextElse();
                  }
                } else if (this.varValue1 === '<') {
                  if (this.varValue >= endVal) {
                    line = this.getNextElse();
                  }
                } else if (this.varValue1 === '<=') {
                  if (this.varValue > endVal) {
                    line = this.getNextElse();
                  }
                } else if (this.varValue1 === '>') {
                  if (this.varValue <= endVal) {
                    line = this.getNextElse();
                  }
                } else if (this.varValue1 === '>=') {
                  if (this.varValue < endVal) {
                    line = this.getNextElse();
                  }
                } else if (this.varValue1 === ['!=', '!==']) {
                  if (this.varValue === endVal) {
                    line = this.getNextElse();
                  }
                } else {
                  line = this.getNextElse();
                }
                break;
              case 'set':
                this.variables[this.nomVar] = this.varValue1;
                break;
              case 'add':
                if (this.haveVariable(this.nomVar)) {
                  this.variables[this.nomVar] = Number(this.variables[this.nomVar]) + Number(this.varValue1);
              }
                break;
              case 'sub':
                if (this.haveVariable(this.nomVar)) {
                    this.variables[this.nomVar] = Number(this.variables[this.nomVar]) - Number(this.varValue1);
                }
                break;
              case 'div':
                if (this.haveVariable(this.nomVar)) {
                  this.variables[this.nomVar] = Number(this.variables[this.nomVar]) / Number(this.varValue1);
              }
                break;
              case 'mul':
                if (this.haveVariable(this.nomVar)) {
                  this.variables[this.nomVar] = Number(this.variables[this.nomVar]) * Number(this.varValue1);
              }
                break;
              case 'random':
                let min: number;
                let max: number;
                if (this.varValue2) {
                  min = Math.floor(Number(this.varValue1));
                  max = Math.floor(Number(this.varValue2)) + 1;
                } else {
                  min = 0;
                  max = Math.floor(Number(this.varValue1)) + 1;
                }
                this.variables[this.nomVar] = Math.floor(Math.random() * max) + min;
                break;
              default:
            }
          }
        } else {
          this.logs.push(this.curLog);
          time = this.curLog.msg.length * 50;
        }
        if (!this.paused) {
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
        }
      } else if (!this.ended) {
        setTimeout(() => {
          this.end();
        }, this.waitTime);
      }
    }
  }

  haveVariable(varValue) {
    return this.variables.hasOwnProperty(varValue);
  }

  getVariableName(val) {
    if (val) {
      if (val.charAt(0) === '$') {
        return val.substring(1, val.length);
      }
      return val;
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
    this.args = [];
    for (let word of words) {
      word = word.trim();
      if (word !== '') {
        if (word.charAt(0) === '-' && opt) {
          this.opts.push(word.slice(1));
        } else {
          if (opt) {
            opt = false;
            this.args.push(word);
          } else {
            this.args.push(word);
          }
        }
      }
    }
    this.arg = this.args.join(' ');
    return;
  }

  resume() {
    this.paused = false;
    this.line += 1;
    this.playLog();
  }

  getLabels() {
    const res = {};
    for (let i = 0; i < this.chatLogs.length; i++) {
      const log = this.chatLogs[i];
      const command: any[] = log.msg.split(' ');
      const labelCommand = command.shift();
      if (labelCommand === '/label') {
        const labelName = command.join(' ');
        res[labelName] = i;
      }
    }
    return res;
  }

  answerInit(count) {
    const res = [];
    for (let i = 0; i < count; i++) {
      res.push(0);
    }
    this.database.object('games/' + this.bookId + '/chat/' + this.bookService.curChatId).update({answers: res});
  }

  send() {

  }

  plus() {

  }

  save() {
    const save = {
      line: this.line,
      chatId: this.chatId,
      variables: this.variables,
      lastChanges: Date.now()
    };
    this.userService.addSave(this.bookId, save);
  }

  async load() {
    const save = await this.userService.loadSave(this.bookId);
    this.line = save.line;
    this.chatId = save.chatId;
    this.variables = save.variables;
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

  answer(answer: string) {
    this.variables.answer = answer.trim();
    this.question = false;
    this.resume();
  }

  toVariable(val: string) {
    if (val !== undefined) {
      if (val.charAt(0) === '$') {
        val = this.getVariableName(val);
        if (this.haveVariable(val)) {
          return this.variables[val];
        }
      }
    }
    return val;
  }

  async askQuestion() {
    const buttons = [];
    for (const answer of this.answers) {
      buttons.push({
        text: this.toVariable(answer),
        handler: () => {
          this.answer(this.toVariable(answer));
        }
      });
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Choisissez votre réponse',
      buttons,
    });
    await actionSheet.present();
  }

  wait(second: number) {
    return new Promise(res => setTimeout(() => res(), second * 1000));
  }

  getNextElse() {
    for (let i = this.line; i < this.chatLogs.length; i++) {
      const log = this.chatLogs[i];
      if (log.msg === '/else') {
        return i;
      }
    }
    return this.chatLogs.length;
  }

  async askInput(): Promise<any> {
    let answered = false;
    let type = 'text';
    if (this.opts.includes('type')) {
      type = this.nomVar1;
    }
    await this.popupService.alertObj({
      inputs: [{
        name: 'res',
        placeholder: this.nomVar,
        type,
      }],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: (data) => {
            this.variables[this.nomVar] = data.res;
            answered = true;
          }
        }
      ]
    });
    await this.popupService.alerter.onDidDismiss();
    if (answered) {
      this.input = false;
      this.resume();
    }
  }

  async options() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Recommencer le livre',
        role: 'destructive',
        icon: 'refresh',
        handler: () => {
          this.alertRestart();
        }
      }, {
        text: 'Annuler',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  async alertRestart() {
    const alert = await this.alertController.create({
      header: 'Attention!',
      message: 'En recommençant ce livre, toutes vos sauvegardes seront perdues définitivement!',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirmer',
          handler: () => {
            this.restart();
          }
        }
      ]
    });
    await alert.present();
  }

  async restart() {
    await this.userService.deleteSave(this.bookId);
    this.play();
  }
}
