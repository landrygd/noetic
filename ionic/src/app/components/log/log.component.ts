import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NewQuestionComponent } from '../modals/new-question/new-question.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})

export class LogComponent implements OnInit {

  @Input() log: any;
  @Input() index = 0;
  @Input() selected = false;
  @Input() edit = false;
  @Input() speed = 200; // CPS Carractères Par Seconde
  @Input() typing = false;

  action = 'talk';
  actor = '';
  color = 'primary';
  msg = '';
  name = '';
  number = 0;
  answers: any[] = [];
  chat = '';

  constructor(private firebase: FirebaseService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.action = this.log.action;
    if (this.log.hasOwnProperty('actor')) {
      this.actor = this.log.actor;
      if (this.actor !== 'Narrator') {
        this.name = this.firebase.getActorById(this.actor).name;
      }
    }
    if (this.log.hasOwnProperty('color')) {
      this.color = this.log.color;
    }
    if (this.log.hasOwnProperty('msg')) {
      this.msg = this.log.msg;
      if (this.typing) {
        setTimeout(() => this.typing = false, (this.msg.length / this.speed) * 60000);
      }
    }
    if (this.log.hasOwnProperty('number')) {
      this.number = this.log.number;
    }
    if (this.log.hasOwnProperty('answers')) {
      this.answers = this.log.answers;
    }
    if (this.log.hasOwnProperty('chat')) {
      this.chat = this.log.chat;
    }
  }

  getClass() {
    if (this.selected) {
      return 'selected';
    } else {
      return 'notselected';
    }
  }

  delete() {
    this.firebase.deleteChatLog(this.index);
  }

  async editAnswers() {
    const modal = await this.modalCtrl.create({
      component: NewQuestionComponent,
      componentProps: {
        actor: this.actor,
        msg: this.msg,
        answers: this.answers,
        curIndex: this.index
      }
    });
    return await modal.present();
  }
}
