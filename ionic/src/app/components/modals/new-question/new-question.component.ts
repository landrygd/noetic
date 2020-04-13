import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.scss'],
})
export class NewQuestionComponent implements OnInit {

  @Input() actor: string = "Narrator";
  @Input() msg: string = "";
  @Input() answers: any[] = [];
  @Input() curIndex: number = -1;

  constructor(public firebase: FirebaseService, private modalCtrl: ModalController) { }

  addAnswer() {
    this.answers.push({
      msg: "",
      goto: 0
    });
  }

  removeAnswer(index) {
    this.answers.splice(index,1);
  }

  ngOnInit() {}

  cancel() {
    this.dismiss();
  }

  confirm() {
    const log = {
      action: 'question',
      msg: this.msg,
      actor: this.actor,
      answers: this.answers
    }
    if(this.curIndex !== -1) {
      this.firebase.editChatLog(log, this.curIndex);
    } else {
      this.firebase.addChatLog(log);
    }
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
