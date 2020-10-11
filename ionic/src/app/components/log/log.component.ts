import { Component, OnInit, Input, Output, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AnimationService } from 'src/app/services/animation.service';
import { BookService } from 'src/app/services/book.service';
import { PopoverController, Platform } from '@ionic/angular';
import { LogEditComponent } from '../log-edit/log-edit.component';
import { Entity } from 'src/app/classes/book';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})

export class LogComponent implements OnInit, OnChanges {

  @Input() message: string;
  @Input() index = 0;
  @Input() selected = false;
  @Input() edit = false;
  @Input() speed = 200; // CPS Carractères Par Seconde
  @Input() typing = false;
  @Input() variables = {};
  @Input() actors = {};

  msg: string;

  actor: Entity;

  @ViewChild('ref', { read: ElementRef, static: true}) ref: ElementRef;

  @Output() scroll = new EventEmitter<void>();
  @Output() action = new EventEmitter<any>();

  actorId: string;
  variablesJSON: any;
  actorsJSON: any;

  msgSlot = 'start';

  color = 'primary';
  name = '';

  button = '';
  actionName = '';

  ownPlayer = false;
  url: SafeResourceUrl;

  narrator = '';

  editClass = 'not-editing';
  itemClass = 'not-editing-item';
  cardClass = 'not-editing-card';

  type = "text";

  constructor(
    public animation: AnimationService,
    public bookService: BookService,
    private popoverController: PopoverController,
    private plat: Platform,
    private sanitizer: DomSanitizer
    ) {}

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.getActor();
    this.variablesJSON = this.variables;
    this.actorsJSON = this.actors;
    if (this.edit) {
      this.editClass = 'editing-text';
      this.itemClass = 'editing-item';
      this.cardClass = 'editing-card';
    }
    if (this.msg === '/finish') {
      this.button = 'Quitter';
      this.actionName = 'finish';
    }
    this.ownPlayer = false;
    if (this.ownPlayer) {
        this.msgSlot = 'end';
    }
    if (this.message.match(/(http(s?):)([/|.|\%|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/g)) {
      this.type = "image";
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.msg);
    };
    if (this.message.match(/https:\/\/www.youtube.com\/watch\?v=([\w|\s])*/g)) {
      this.type = "youtube";
      const id = this.message.split('v=')[1];
      const link = "https://www.youtube.com/embed/" + id
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(link);
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
    // this.chatService.deleteChatLog(this.index);
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

  getActor() {
    const msgArray = this.message.split(':');
    const key = msgArray.shift().substring(1);
    this.actor = this.bookService.book.getEntity(key);
    if (this.actor) {
      this.msg = msgArray.join(':').trim();
    } else {
      this.msg = this.message;
    }
  }
}
