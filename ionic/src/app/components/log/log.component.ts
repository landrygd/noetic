import { Component, OnInit, Input, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AnimationService } from 'src/app/services/animation.service';
import { ActorService } from 'src/app/services/book/actor.service';
import { ChatService } from 'src/app/services/book/chat.service';
import { BookService } from 'src/app/services/book.service';
import { ThemeService } from 'src/app/services/theme.service';
import { PopoverController, Platform } from '@ionic/angular';
import { LogEditComponent } from '../log-edit/log-edit.component';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})

export class LogComponent implements OnInit {

  @Input() log: {msg: string, actor: string};
  @Input() index = 0;
  @Input() selected = false;
  @Input() edit = false;
  @Input() speed = 200; // CPS Carractères Par Seconde
  @Input() typing = false;
  @Input() variables = {};
  @Input() actors = {};

  @ViewChild('ref', { read: ElementRef, static: true}) ref: ElementRef;

  @Output() scroll = new EventEmitter<void>();
  @Output() action = new EventEmitter<any>();

  actorId: string;
  variablesJSON: any;
  actorsJSON: any;

  msgSlot = 'start';

  color = 'primary';
  msg = '';
  name = '';

  button = '';
  actionName = '';

  ownPlayer = false;

  narrator = '';

  editClass = 'not-editing';
  itemClass = 'not-editing-item';
  cardClass = 'not-editing-card';

  constructor(
    private actorService: ActorService,
    public animation: AnimationService,
    public chatService: ChatService,
    public bookService: BookService,
    private popoverController: PopoverController,
    private plat: Platform
    ) {}

  ngOnInit() {
    this.variablesJSON = this.variables;
    this.actorsJSON = this.actors;
    if (this.edit) {
      this.editClass = 'editing-text';
      this.itemClass = 'editing-item';
      this.cardClass = 'editing-card';
    }
    if (this.log.hasOwnProperty('actor')) {
      this.actorId = this.log.actor;
    } else {
      if (!this.edit) {
        this.narrator = 'narrator';
      }
    }
    if (this.log.hasOwnProperty('msg')) {
      this.msg = this.log.msg;
      if (this.typing) {
        setTimeout(() => this.endTyping(), (this.msg.length / this.speed) * 30000);
      }
      if (this.msg === '/finish') {
        this.button = 'Quitter';
        this.actionName = 'finish';
      }
    }
    this.ownPlayer = this.actorService.isOwnActor(this.actorId);
    if (this.ownPlayer) {
        this.msgSlot = 'end';
    }
    this.scroll.emit();
  }

  endTyping() {
    this.typing = false;
    this.scroll.emit();
  }

  getItemColor() {
    if (this.edit) {
      if (this.selected) {
        return 'primary';
      } else {
        return 'light';
      }
    } else {
      return 'transparent';
    }
  }

  getButtonColor() {
    if (this.selected) {
      return 'light';
    } else {
      return 'primary';
    }
  }

  delete() {
    this.chatService.deleteChatLog(this.index);
  }

  async logEdit(ev: any) {
    const popover = await this.popoverController.create({
      component: LogEditComponent,
      event: ev,
      translucent: false,
      showBackdrop: false
    });
    await popover.present();
    const action = (await popover.onDidDismiss()).data;
    if (action) {
      this.action.emit(action.action);
    }
  }

  isEnd(msg) {
    if (msg === '/finish') {
      return true && !this.edit;
    }
    return false;
  }

  actionEmit(action: string) {
    this.action.emit(action);
  }
}
