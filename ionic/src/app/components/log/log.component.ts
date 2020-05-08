import { Component, OnInit, Input, Output, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController, NavController } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import { AnimationService } from 'src/app/services/animation.service';

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

  @ViewChild('ref', { read: ElementRef, static: true}) ref: ElementRef;

  @Output() action = new EventEmitter<string>();
  @Output() scroll = new EventEmitter<void>();

  actor: string;
  color = 'primary';
  msg = '';
  name = '';

  button = '';
  actionName = '';

  constructor(
    private firebase: FirebaseService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    public animation: AnimationService
    ) {}

  actionEmit(name: string) {
    this.action.emit(name);
  }

  ngOnInit() {
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
        setTimeout(() => this.endTyping(), (this.msg.length / this.speed) * 30000);
      }
      if (this.msg === '/end') {
        this.button = 'Quitter';
        this.actionName = 'end';
      }
    }
    this.animation.fadeIn(this.ref);
    this.scroll.emit();
  }

  endTyping() {
    this.typing = false;
    this.scroll.emit();
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

  
}
