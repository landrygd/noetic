import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})

export class LogComponent implements OnInit {

  @Input() log: object;
  @Input() index: number = 0;
  @Input() selected: boolean = false;
  @Input() edit: boolean = false;

  action: string = 'talk';
  actor: string = 'narrator';
  color: string = 'primary';
  msg: string = '';
  name: string = '';

  constructor(private firebase: FirebaseService) {

  }

  ngOnInit() {
    this.action = this.log['action'];
    if(this.log.hasOwnProperty('actor')) {
      this.actor = this.log['actor'];
      if(this.actor !== 'Narrator') {
        this.name = this.firebase.getActorById(this.actor).name;
      }
    }
    if(this.log.hasOwnProperty('color')) {
      this.color = this.log['color'];
    }
    if(this.log.hasOwnProperty('msg')) {
      this.msg = this.log['msg'];
    }
  }

  getClass() {
    if(this.selected) {
      return "selected";
    } else {
      return "notselected";
    }
  }

  delete() {
    this.firebase.deleteChatLog(this.index);
  }
}
