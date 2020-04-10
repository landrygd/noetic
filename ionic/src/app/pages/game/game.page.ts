import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  id: string;
  sub: Subscription;
  line: number = -1;
  chat: string = "main";
  chatLogs: any[] = [];
  curHost: string = '';

  constructor(public firebase: FirebaseService, public navCtrl: NavController, public database: AngularFireDatabase) { }

  ngOnInit() {
    this.firebase.newGame();
    this.id = this.firebase.curGame;
    this.sub = this.database.object("games/"+this.id).valueChanges().subscribe((value) => {
      this.curHost = value["host"];
      const curChat = this.firebase.chatLogs;
      if(this.line !== value["log"] && curChat !== []) {
        this.line = value["log"];
        const log = curChat[this.line];
        this.chatLogs.push(log);
        if(this.isHost() && this.line < curChat.length-1) {
          if(log['action'] == 'talk' ) {
            let time = 1000;
            if (log.hasOwnProperty('msg')) {
              time = log['msg'].length * 200
            }
            setTimeout(() => this.nextLine(), time);
          }
        }
      }
    });
  }

  send() {
    console.log('send');
  }

  nextLine(line = this.line+1) {
    this.database.object("games/"+this.id).update({log:line});
  }

  isHost(): boolean {
    return this.firebase.userId == this.curHost;
  }

  exit() {
    this.sub.unsubscribe();
    this.firebase.leaveGame();
    this.navCtrl.back();
  }

}
