import { Component, OnInit, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AnimationService } from 'src/app/services/animation.service';
import { ActorService } from 'src/app/services/book/actor.service';
import { ChatService } from 'src/app/services/book/chat.service';

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

  actorId: string;
  actor: any;

  color = 'primary';
  msg = '';
  name = '';

  button = '';
  actionName = '';

  constructor(
    private actorService: ActorService,
    public animation: AnimationService,
    private chatService: ChatService
    ) {}

  actionEmit(name: string) {
    this.action.emit(name);
  }

  ngOnInit() {
    if (this.log.hasOwnProperty('actor')) {
      this.actorId = this.log.actor;
      this.actor = this.actorService.getActor(this.actorId);
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
    if (!this.edit) {
      this.animation.fadeIn(this.ref);
    }
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
    this.chatService.deleteChatLog(this.index);
  }
}
