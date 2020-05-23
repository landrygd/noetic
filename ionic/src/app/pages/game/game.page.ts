import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, ActionSheetController, IonContent } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book.service';
import { ChatService } from 'src/app/services/book/chat.service';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';
import { MediaService } from 'src/app/services/media.service';
import { ActorService } from 'src/app/services/book/actor.service';

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
  actors = {};
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
  places: {};
  place: string;

  answers: string[];

  variables: any = {};

  cptChatLabel: any = {};

  settings: any = {};

  nomVar: string;
  nomVar1: string;
  nomVar2: string;
  varValue: any;
  varValue1: any;
  varValue2: any;

  checkLabelRefresher: any;

  autoScroll = true;

  @ViewChild('bg', {static: true, read: ElementRef}) bg: ElementRef;

  constructor(
    public bookService: BookService,
    public chatService: ChatService,
    public navCtrl: NavController,
    public database: AngularFireDatabase,
    public alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,
    private popupService: PopupService,
    public userService: UserService,
    private alertController: AlertController,
    private mediaService: MediaService,
    private actorService: ActorService
    ) {
    }

  ngOnInit() {
    this.play();
  }

  async play() {
    this.checkLabelRefresher = setInterval(() => {
      this.cptChatLabel = {};
    }, 60000);
    this.getWallpaper();
    this.input = false;
    this.question = false;
    this.paused = false;
    this.exited = false;
    this.logs = [];
    this.chatId = this.bookService.curChatId;
    this.bookId = this.bookService.curBookId;
    if (this.userService.haveSave(this.bookId)) {
      await this.load();
      this.playChat(this.chatId, this.line);
    } else {
      this.line = 0;
      this.variables = {};
      this.playChat(this.chatId);
    }
  }

  async playChat(chatId = 'main', line = 0) {
    this.line = line;
    this.chatService.getChat(chatId);
    this.chat = this.chatService.getChat(chatId);
    this.chatLogs = this.chat.logs;
    this.labels = this.getLabels();
    this.mediaService.loadSounds(this.getChatSounds());
    this.mediaService.loadAmbiances(this.getChatAmbiances());
    this.mediaService.loadMusics(this.getChatMusics());
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
                    if (this.checkCptLabel(this.chatService.getChatIdByName(this.arg))) {
                      gochat = this.arg;
                    }
                  }
                } else {
                  if (this.labels.hasOwnProperty(this.arg)) {
                    if (this.checkCptLabel(this.chat.id, this.arg)) {
                      line = this.labels[this.arg];
                    }
                  }
                }
                break;
              case 'sound':
                if (this.opts.includes('stop')) {
                  if (this.args.length > 0) {
                    this.mediaService.stopSound(this.args[0]);
                  } else {
                    this.mediaService.stopSound();
                  }
                } else {
                  this.mediaService.playSound(this.args[0]);
                }
                break;
              case 'ambiance':
                if (this.opts.includes('stop')) {
                  if (this.args.length > 0) {
                    this.mediaService.stopAmbiance(this.args[0]);
                  } else {
                    this.mediaService.stopAmbiance();
                  }
                } else {
                  this.mediaService.playAmbiance(this.args[0]);
                }
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
                if (this.opts.includes('stop')) {
                  this.mediaService.stopMusic();
                } else {
                  const once = this.opts.includes('once');
                  this.mediaService.playMusic(this.args[0], !once);
                }
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
                this.setVariable('set');
                break;
              case 'add':
                this.setVariable('add');
                break;
              case 'sub':
                this.setVariable('sub');
                break;
              case 'div':
                this.setVariable('div');
                break;
              case 'mul':
                this.setVariable('mul');
                break;
              case 'random':
                this.setVariable('random');
                break;
              case 'control':
                if (this.isActor(this.nomVar)) {
                  this.actorService.setOwnActor(this.toActorName(this.nomVar));
                }
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
              this.playChat(this.chatService.getChatIdByName(gochat));
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

  getVariable() {
    return this.setVariable('get');
  }

  setVariable(operator) {
    if (this.isActor(this.args[0])) {
      const value = this.varValue1;
      const path = this.arg.split('$');
      const actorId = this.actorService.getActorId(this.toActorName(path[0]));
      const nomVar = path[1].split(' ')[0];
      if (!this.actors[actorId]) {
        this.actors[actorId] = {};
      }
      if (operator === 'set') {
        this.actors[actorId][nomVar] = value;
      } else if (operator === 'random') {
        this.actors[actorId][nomVar] = this.getRandom();
      }
      if (this.actors[actorId][nomVar]) {
        if (operator === 'add') {
          this.actors[actorId][nomVar] = Number(this.actors[actorId][nomVar]) + Number(value);
        } else if (operator === 'sub') {
          this.actors[actorId][nomVar] = Number(this.actors[actorId][nomVar]) - Number(value);
        } else if (operator === 'mul') {
          this.actors[actorId][nomVar] = Number(this.actors[actorId][nomVar]) * Number(value);
        } else if (operator === 'div') {
          this.actors[actorId][nomVar] = Number(this.actors[actorId][nomVar]) / Number(value);
        }
        return this.actors[actorId][nomVar];
      }
    } else {
      const value = this.varValue1;
      if (operator === 'set') {
        this.variables[this.nomVar] = value;
      } else if (operator === 'random') {
        this.variables[this.nomVar] = this.getRandom();
      }
      if (this.haveVariable(this.nomVar)) {
        if (operator === 'add') {
          this.variables[this.nomVar] = Number(this.variables[this.nomVar]) + Number(value);
        } else if (operator === 'sub') {
          this.variables[this.nomVar] = Number(this.variables[this.nomVar]) - Number(value);
        } else if (operator === 'mul') {
          this.variables[this.nomVar] = Number(this.variables[this.nomVar]) * Number(value);
        } else if (operator === 'div') {
          this.variables[this.nomVar] = Number(this.variables[this.nomVar]) / Number(value);
        }
        return this.variables[this.nomVar];
      }
    }
    return null;
  }

  toActorName(actorName: string): string {
    if (this.isActor(actorName)) {
      return actorName.substring(1, actorName.length);
    } else {
      return actorName;
    }
  }

  getRandom() {
    let min: number;
    let max: number;
    if (this.varValue2) {
      min = Math.floor(Number(this.varValue1));
      max = Math.floor(Number(this.varValue2)) + 1;
    } else {
      min = 0;
      max = Math.floor(Number(this.varValue1)) + 1;
    }
    const res = Math.floor(Math.random() * max) + min;
    return res;
  }

  isActor(actorName: string) {
    return actorName.charAt(0) === '@';
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

  checkCptLabel(chatId = this.chat.id, labelName = 'main') {
    if (this.cptChatLabel.hasOwnProperty(chatId)) {
      if (this.cptChatLabel[chatId].hasOwnProperty(labelName)) {
        this.cptChatLabel[chatId][labelName] += 1;
        const cpt = this.cptChatLabel[chatId][labelName];
        if (cpt >= 10) {
          if (labelName === 'main') {
            if (this.bookService.debug) {
              this.popupService.alert(
                'Un chat ne peut être utilisé que 10 fois par minute maximum! Il sera ignoré pendant la lecture ce quotas dépassé.'
                );
            }
            return false;
          } else {
            if (this.bookService.debug) {
              this.popupService.alert(
                'Un label ne peut être utilisé que 10 fois par minute maximum! Il sera ignoré pendant la lecture ce quotas dépassé.'
                );
            }
            return false;
          }
        }
      } else {
        this.cptChatLabel[chatId] = {[labelName]: 1};
      }
    } else {
      this.cptChatLabel[chatId] = {main: 1};
    }
    return true;
  }

  scrollToBottom(autoScroll = false) {
    if (autoScroll) {
      this.autoScroll = true;
    }
    if (this.autoScroll) {
      setTimeout(() => {
        this.content.scrollToBottom(400);
        }, 100);
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
      actor: this.actorService.ownActor,
      place: this.place,
      variables: this.variables,
      actors: this.actors,
      places: this.places,
      settings: this.settings,
      lastChanges: Date.now()
    };
    this.userService.addSave(this.bookId, save);
  }

  async load() {
    const save = await this.userService.loadSave(this.bookId);
    this.actorService.ownActor = save.actor;
    this.place = save.place;
    this.places = save.places;
    this.line = save.line;
    this.actors = save.actors;
    this.chatId = save.chatId;
    this.variables = save.variables;
    this.settings = save.settings;
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
    clearInterval(this.checkLabelRefresher);
    this.mediaService.stopMusic();
    this.mediaService.stopAmbiance();
    this.actorService.ownActor = '';
    this.exited = true;
    if (!this.bookService.debug) {
      this.bookService.unsyncBook();
    }
    this.navCtrl.pop();
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
    if (this.userService.haveSave(this.bookId)) {
      await this.userService.deleteSave(this.bookId);
    }
    this.play();
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

  getChatSounds() {
    const sounds: string[] = [];
    this.chatLogs.forEach(log => {
      if (this.getCommand(log.msg) === '/sound') {
        sounds.push(this.getFirstArg(log.msg));
      }
    });
    return sounds;
  }

  getChatMusics() {
    const sounds: string[] = [];
    this.chatLogs.forEach(log => {
      if (this.getCommand(log.msg) === '/music') {
        const arg = this.getFirstArg(log.msg);
        if (arg !== '-stop') {
          sounds.push(arg);
        }
      }
    });
    return sounds;
  }

  getChatAmbiances() {
    const sounds: string[] = [];
    this.chatLogs.forEach(log => {
      if (this.getCommand(log.msg) === '/ambiance') {
        const arg = this.getFirstArg(log.msg);
        if (arg !== '-stop') {
          sounds.push(arg);
        }
      }
    });
    return sounds;
  }

  getCommand(msg: string) {
    return msg.split(' ')[0];
  }

  getFirstArg(msg: string) {
    return msg.split(' ')[1];
  }
}
