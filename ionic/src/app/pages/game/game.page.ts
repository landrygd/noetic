import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController, AlertController, ActionSheetController, IonContent } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/classes/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  id: string;
  sub: Subscription;
  line: number = -1;
  chat: string = "main";
  chatLogs: any[] = [];
  chatId: string = 'main';
  curHost: string = '';
  game: Game;
  loopMinTime = 1000;
  question: boolean = false;

  constructor(
    public firebase: FirebaseService, 
    public navCtrl: NavController, 
    public database: AngularFireDatabase,
    public alertCtrl: AlertController,
    public actionSheetController: ActionSheetController
    ) { 
    }

  ngOnInit() {
    this.game = new Game('New Game', this.firebase.userId, this.firebase.curBookId, 'main', this.firebase);
    this.firebase.newGame(this.game);
    this.id = this.firebase.curGame;
    setTimeout(()=> {
    this.sub = this.database.object("games/"+this.id).valueChanges().subscribe((value) => {
      this.game.setFromJson(value);
      this.game.setChatId(this.chatId);
      this.curHost = this.game.getCurHost();
      const chatLogs = this.game.getChatLogs();
      const chat = this.game.getChat();
      let logId = this.game.getLogId();
      if(this.line !== logId && chatLogs !== []) {
        this.line = logId;
        const log = this.game.getLog();
        if(log['action'] !== 'goto' && log['action'] !== 'label' && log['action'] !== 'gochat') {
          this.chatLogs.push(log);
        }
        if(this.game.isHost() && this.line < chatLogs.length) {
          if(log['action'] == 'talk' ) {
            let time = 1000;
            if (log.hasOwnProperty('msg')) {
              time = log['msg'].length * 100
            }
            setTimeout(() => this.nextLine(), time);
          } else if(log['action'] == 'goto' ) {
            const line = this.firebase.getLabelLine(log['number']);
            if (line == -1) {
              this.nextLine();
            } else {
              this.nextLine(line);
            }
          } else if(log['action'] == 'gochat' ) {
            if(this.firebase.haveChat(log['chat'])) {
              let chatId: string = this.firebase.getChatIdByName(log['chat']);
              this.firebase.unsyncChat();
              this.firebase.syncChat(chatId);
              setTimeout(()=>this.database.object("games/"+this.id+"/chat/"+this.game.chatId).update({name:log['chat'], log:0}), 100);
            } else {
              this.nextLine();
            }
          } else if(log['action'] == 'label' ) {
            if(this.labelCheck(log['number'])) {
              this.nextLine();
            } else {
              this.alertLoop();
            }
          } else if(log['action'] == 'question' ) {
            this.question = true;
            this.answerInit(log['answers'].length);
          }
        }
      }
      if(chat.hasOwnProperty('answers')) {
        if(this.game.getAnswersCount() >= this.game.getPlayerCount()) {
          let goto = this.game.getAnswerGoto();
          this.database.object("games/"+this.id+"/chat/"+this.game.chatId).update({answers:[]});
          const line = this.firebase.getLabelLine(goto);
          this.nextLine(line);
        }
      }
      this.scrollToBottom();
    });
  }, 1000);
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }

  labelCheck(number): boolean {
    let chat = this.game.chat[this.chatId];
    if(chat.hasOwnProperty('time')) {
      if(chat['time'].hasOwnProperty('label'+number)) {
        const labelTime = new Date(chat['time']["label"+number]['time']).getTime();
        if ((new Date().getTime() - labelTime) < 1000) {
          return false;
        }
      } 
    } 
    this.database.object("games/"+this.id+"/chat/"+this.chatId+"/time/label"+number).set({time:Date().toString()})
    return true;
  }

  answerInit(count) {
    let res = [];
    for(let i = 0; i<count; i++) {
      res.push(0);
    }
    this.database.object("games/"+this.id+"/chat/"+this.game.chatId).update({answers:res});
  }

  send() {

  }

  plus() {

  }

  nextLine(line = this.line+1) {
    const chatLogs = this.game.getChatLogs();
    if(line < chatLogs.length) {
      this.database.object("games/"+this.id+"/chat/"+this.game.chatId).update({log:line});
    }
  }

  exit() {
    this.sub.unsubscribe();
    this.firebase.leaveGame();
    this.navCtrl.back();
  }

  async alertLoop() {
    const alert = await this.alertCtrl.create({
      header: 'Too fast!',
      message: "For security reasons, we avoid infinity fast loops.<br><strong>Make sure that your labels and gotos aren't too near!</strong>",
      buttons: [
        {
          text: 'Exit',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.exit();
          }
        }, {
          text: 'Continue',
          handler: () => {
            this.nextLine();
          }
        }
      ]
    });
    await alert.present();
  }

  answer(index) {
    let answers = this.game.getAnswersList();
    answers.splice(index,1,answers[index]+1)
    this.database.object("games/"+this.id+"/chat/"+this.game.chatId).update({answers:answers});
    this.question = false;
  }

  async anwserList() {
    let buttons = [];
    let answers = this.game.getAnswers()
    for(let i = 0; i < answers.length; i++) {
      let answer = answers[i];
      buttons.push({
        text: answer['msg'],
        handler: () => {
          this.answer(i);
        }
      });
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose your answer',
      buttons: buttons,
    });
    await actionSheet.present();
  }
}
