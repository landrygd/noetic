import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { ModalController, IonContent, ActionSheetController, AlertController,
         IonTextarea, PopoverController, Platform, ToastController } from '@ionic/angular';
import { PopupService } from 'src/app/services/popup.service';
import { BookService } from 'src/app/services/book.service';
import { SlidesService } from 'src/app/services/slides.service';
import { MediaService } from 'src/app/services/media.service';
import { ManualComponent } from 'src/app/components/modals/manual/manual.component';
import { TutoPopoverComponent } from 'src/app/components/tuto-popover/tuto-popover.component';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { AngularFirestore } from '@angular/fire/firestore';
import Commands from '../../../assets/json/commands.json';
import { AudioListComponent } from 'src/app/components/modals/audio-list/audio-list.component';
import { Entity, Script } from 'src/app/classes/book';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('bg', { static: false }) content: IonContent;
  @ViewChild('bg', {static: true, read: ElementRef}) bg: ElementRef;
  @ViewChild('chatBar', {static: true, read: IonTextarea}) chatBar: IonTextarea;

  segment = 'actor';
  text = '';
  selection = [];
  avatar = 'assets/avatar/man.png';
  actor: string;
  textarea = false;
  autoScroll = true;
  loaded = false;
  script: Script;
  messages: string[];
  lastClosed: number;
  tabs: any[] = [];

  sound = false;
  music = false;
  ambiance = false;

  edittingLog = false;
  history: {action: string, index: number, logs: string[]}[] = [];
  historyIndex = -1;

  tuto: string[] = [];

  ERRORS: any = {};
  COMMON: any = {};

  errorSub: Subscription;
  commonSub: Subscription;
  tutoSub: Subscription;
  actors: Entity[];

  tabColor = '#000';

  chatBarFocused = false;

  commands = [];

  constructor(
    public bookService: BookService,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public popup: PopupService,
    public slides: SlidesService,
    public mediaService: MediaService,
    private popoverController: PopoverController,
    private userService: UserService,
    private translator: TranslateService,
    private themeService: ThemeService,
    private firestore: AngularFirestore,
    private popupService: PopupService,
    private toastController: ToastController
    ) {}

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.shortcuts(event);
  }

  ngOnInit() {
    this.script = this.bookService.script;
    this.actors = this.bookService.book.getEntities('actor');
    this.messages = this.script.messages;
    this.refresh();
    this.historyIndex = this.history.length;
    this.loaded = true;
    setTimeout(() => this.scrollToBottom(), 200);
    this.getTraduction();
    this.commands = [];
    Object.keys(Commands).forEach((key) => {
      this.commands.push(Commands[key]);
    });
  }

  showCat(name) {

  }

  onChatBarFocused() {
    this.chatBarFocused = true;
  }

  onChatBarBlurred() {
    this.chatBarFocused = false;
  }

  shortcuts(event: KeyboardEvent): void {
    if (!this.chatBarFocused) {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'c':
            this.copy();
            break;
          case 'v':
            this.paste();
            break;
          case 'x':
            this.cut();
            break;
          case 'z':
            this.undo();
            break;
          case 'y':
            this.redo();
            break;
          case 'a':
            this.selectAll();
            break;
          case 's':
            this.save();
            break;
        }
      } else if (event.shiftKey) {
        switch (event.key) {
          case 'E':
            this.edit();
            break;
        }
      } else {
        switch (event.key) {
          case 'Backspace':
            this.delete();
            break;
        }
      }
    }
 }

 async toast(message, position) {
   const toast = await this.toastController.create({
     message,
     position,
     duration: 1000
   });
   toast.present();
 }

  getTraduction() {
    this.tutoSub = this.translator.get('TUTO').subscribe((val) => {
      this.tuto = val;
    });
    this.errorSub = this.translator.get('ERRORS').subscribe((val) => {
      this.ERRORS = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.tutoSub.unsubscribe();
    this.errorSub.unsubscribe();
    this.commonSub.unsubscribe();
  }

  // getWallpaper() {
  //   if (this.bookService.book.wallpaper) {
  //     const wallpaper = this.bookService.book.wallpaper;
  //     if (wallpaper !== '' && wallpaper.substring(0, 4) !== 'http') {
  //       const res = 'url(' + this.mediaService.getWallpaperURL(wallpaper) + ')';
  //       this.bg.nativeElement.style.setProperty('--background', res + ' no-repeat center center / cover');
  //     }
  //   }
  // }



  ngAfterViewInit() {
    if (this.themeService.darkMode) {
      this.tabColor = '#fff';
    }
    if (this.userService.haveTuto()) {
      setTimeout(() => {this.showTuto(); }, 500);
    }
    this.scrollToBottom();
  }

  scrollToBottom(autoScroll = false) {
    if (autoScroll) {
      this.autoScroll = true;
    }
    if (this.autoScroll) {
      setTimeout(() => {
        this.content.scrollToBottom(0);
        }, 200);
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

  send() {
    let log: string = this.text;
    if (this.actor && log.charAt(0) !== '/') {
      log = '@' + this.actor + ': ' + this.text;
    }
    if ((log.substring(0, 7).toLowerCase() === '/l main' || log.substring(0, 11).toLowerCase() === '/label main')) {
      this.popup.alert(this.ERRORS.invalidLabelName);
    } else {
      if (this.edittingLog) {
        const index = this.selection[this.selection.length - 1] + 1;
        this.messages.splice(index, 0, log);
        this.selection = [];
        this.edittingLog = false;
      } else {
        if (this.selection.length === 0) {
          this.addHistoryAction({action: 'add', index: this.messages.length, logs: [log]});
          this.messages.push(log);
          if (this.text.indexOf('/if') === 0 || this.text.indexOf('/question') === 0) {
            this.addHistoryAction({action: 'add', index: this.messages.length, logs: [{msg: '/end'}]});
            this.messages.push('/end');
          }
        } else {
          const index = this.selection[this.selection.length - 1] + 1;
          this.messages.splice(index, 0, log);
          this.selection = [this.selection[this.selection.length - 1] + 1];
        }
      }
    }
    this.update();
    this.refresh();
    setTimeout(() => this.scrollToBottom(), 50);
    setTimeout(() => this.text = '', 1);
    this.textarea = false;
  }

  refresh() {
    this.script.messages = [...this.messages];
    const res = this.script.getTabs();
    this.lastClosed = res.lastClosed;
    this.tabs = res.tabs;
  }

  save() {
    this.bookService.saveBook();
  }

  select(event, index) {
    const relativeX = event.clientX / event.target.clientWidth;
    if (relativeX < 0.9) {
      if (event) {
        if (event.shiftKey) {
          this.selection = this.getMajSelection(index);
          return;
        } else {
          if (!(this.selection.includes(index))) {
            this.selection = [index];
            return;
          }
        }
      }
      this.selection = [];
      this.text = '';
    }
  }

  getMajSelection(x2): any[] {
    const x1 = this.selection[0];
    const min = Math.min(x1, x2);
    const max = Math.max(x1, x2);
    const res = [];
    for (let i = min; i <= max; i++) {
      res.push(i);
    }
    return res;
  }

  getClass(index) {
    if (this.selection.includes(index)) {
      return 'selected';
    } else {
      return 'notselected';
    }
  }

  enter(keyCode) {
    if (keyCode === 13) {
      this.textarea = true;
      this.send();
    }
  }

  setActor(id) {
    if (id === this.actor) {
      this.actor = undefined;
    } else {
      this.actor = id;
    }
  }

  getLogOpacity(index) {
    if (index > this.lastClosed) {
      return 0.5;
    }
    return 1;
  }


  deleteScript() {
    this.bookService.book.deleteScript(this.script.name);
  }

  newActor() {
    this.bookService.newEntity('actor');
  }

  getClassFabActor(actor) {
    if (actor === this.actor) {
      return 'selectedfab';
    } else {
      return 'notselectedfab';
    }
  }

  isLogSelected(index) {
    if (this.selection.includes(index)) {
      return true;
    } else {
      return false;
    }
  }

  debug() {
    this.bookService.play(this.script.name, true);
  }

  action(name) {
    this.popup.toast(this.ERRORS.buttonsNotAvaible);
  }

  // renameChat() {
  //   this.script.rename.renameChat();
  // }

  // async settings() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Paramètres',
  //     buttons: [{
  //       text: this.COMMON.delete,
  //       role: 'destructive',
  //       icon: 'trash',
  //       handler: () => {
  //         this.deleteChat();
  //       }
  //     }, {
  //       text: this.COMMON.rename,
  //       icon: 'create',
  //       handler: () => {
  //         this.renameChat();
  //       }
  //     }, {
  //       text: this.COMMON.cancel,
  //       icon: 'close',
  //       role: 'cancel'
  //     }]
  //   });
  //   await actionSheet.present();
  // }

  async manual(type = '') {
    const modal = await this.modalCtrl.create({
    component: ManualComponent,
    componentProps: {type}
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (type !== '') {
      type = '/' + type + ' ';
    }
    if (typeof data.data === 'string') {
      this.text = type + data.data;
    }
  }



  async showTuto(index = 0) {
    if (this.tuto.length > index) {
      const message = this.tuto[index];
      const toast = await this.toastController.create({
        message,
        position: 'top',
        color: 'primary',
        buttons: [
          {
            icon: 'checkmark',
            text: 'OK',
            handler: () => {
              toast.dismiss();
              this.showTuto(index + 1);
            }
          },
          {
            icon: 'play-skip-forward',
            text: 'Passer',
            handler: () => {
              toast.dismiss();
              this.showTuto(this.tuto.length);
            }
          }
        ],
      });
      toast.present();
    } else {
      this.userService.deleteTuto();
    }
  }

  async presentPopover(ev: CustomEvent<any>, index) {
    const end = index >= this.tuto.length - 1;
    const popover = await this.popoverController.create({
      component: TutoPopoverComponent,
      componentProps: {
        info: this.tuto[index],
        end
      },
      event: ev,
      translucent: false
    });
    await popover.present();
    const res = await popover.onDidDismiss();
    if (!res.data.hasOwnProperty('cancel')) {
      this.showTuto(index + 1);
    } else {
      this.userService.deleteTuto();
      const alert = await this.alertController.create({
        message: 'Vous pouvez toujours revoir ce tutoriel en le réactivant dans les paramètres du livre',
        buttons: ['Ok'],
      });
      await alert.present();
    }
  }

  changeMsg() {
    setTimeout(() => {
      const command = this.text.split(' ')[0];
      this.sound = false;
      this.music = false;
      this.ambiance = false;
      if (command === '/sound') {
        this.sound = true;
      } else if (command === '/music') {
        this.music = true;
      } else if (command === '/ambiance') {
        this.ambiance = true;
      }
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }, 100);
  }

  async showAudio(type: string) {
    const modal = await this.modalCtrl.create({
    component: AudioListComponent,
    componentProps: {type}
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (type !== '') {
      type = '/' + type + ' ';
    }
    if (data.data) {
      this.text = type + data.data;
    }
  }

  actionLog(event) {
    switch (event) {
      case 'copy':
        this.copy();
        break;
      case 'paste':
        this.paste();
        break;
      case 'delete':
        this.delete();
        break;
      case 'edit':
        this.edit();
        break;
    }
  }

  getSelectionLogs() {
    const min = this.selection[0];
    const max = min + this.selection.length;
    const res = [];
    for (const log of this.messages.slice(min, max)) {
      res.push(JSON.stringify(log));
    }
    return res.join('%SEP%');
  }

  copy() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.getSelectionLogs();
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.popupService.toast('Copié dans le presse papier');
  }

  cut() {
    this.copy();
    this.delete();
  }

  delete(index = this.selection[0], length = this.selection.length) {
    const res = this.messages;
    const logs = res.slice(index, index + length);
    res.splice(index, length);
    this.addHistoryAction({action: 'delete', index, logs});
    this.update();
    this.selection = [];
  }

  async paste() {
    const clipboard = await navigator.clipboard.readText();
    const clipbordLogs = clipboard.split('%SEP%').reverse();
    const logs: any[] = [];
    for (const log of clipbordLogs) {
      logs.push(JSON.parse(log));
    }
    let min;
    if (this.selection === []) {
      min = this.messages.length - 1;
    } else {
      min = this.selection[this.selection.length - 1] + 1;
    }
    const res = this.messages.slice();
    for (const log of logs) {
      res.splice(min, 0, log);
    }
    this.addHistoryAction({action: 'add', index: this.messages.length, logs});
    this.update();
  }

  update() {
    this.script.messages = this.messages;
    this.bookService.book.setScript(this.script);
    this.bookService.saveBook();
  }

  addHistoryAction(value) {
    this.history = this.history.slice(0, this.historyIndex);
    this.history.push(value);
    this.historyIndex = this.history.length;
  }

  undo(reversed = false) {
    if (this.historyIndex > 0) {
      this.historyIndex -= 1;
      const lastModif = this.history[this.historyIndex];
      let action = lastModif.action;
      if (reversed) {
        if (action === 'add') {
          action = 'delete';
        } else {
          action = 'add';
        }
      }
      switch (action) {
        case 'add':
          this.delete(lastModif.index, lastModif.logs.length);
          break;
        case 'delete':
          const logs = lastModif.logs.reverse();
          const res = this.messages.slice();
          for (const log of logs) {
            res.splice(lastModif.index, 0, log);
          }
          this.update();
          break;
      }
    }
  }

  redo() {
    if (this.historyIndex > 0) {
      this.historyIndex += 1;
      this.undo(true);
    }
  }

  edit() {
    this.edittingLog = true;
    const index = this.selection[0];
    this.text = this.script.messages[index];
  }

  selectAll() {
    this.selection = [];
    for (let i = 0; i < this.messages.length; i++) {
      this.selection.push(i);
    }
  }

  segmentChanged(ev: any) {
    this.segment = ev.target.value;
  }

  useCommand(name) {
    this.text = Commands[name].ex[0];
  }
}
