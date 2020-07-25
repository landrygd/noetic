import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import Commands from '../../../../assets/json/commands.json';
import Sounds from '../../../../assets/json/sounds.json';
import Musics from '../../../../assets/json/musics.json';
import Ambiances from '../../../../assets/json/ambiances.json';
import { MediaService } from 'src/app/services/media.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Command } from 'src/app/classes/command';
import { CommandEntriesComponent } from '../command-entries/command-entries.component';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss'],
})

export class ManualComponent implements OnInit, OnDestroy {

  @Input() type: string;

  MANUAL: any = {};
  COMMON: any = {};

  manualSub: Subscription;
  commonSub: Subscription;

  commandSub: Subscription;
  COMMANDS: any = {};

  commands = [];

  filter = '';

  results = [];

  placeholder: string;

  categories: [
    'control',
    'variables',
    'appearance',
    'audio'
  ];

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private mediaService: MediaService,
    private translator: TranslateService,
    private modalController: ModalController
    ) {}

  async ngOnInit() {
    this.getTraduction();
    this.placeholder = this.MANUAL.command;
    if (this.type === 'sound') {
      this.placeholder = this.MANUAL.sound;
      Object.keys(Sounds).forEach((key) => {
        const sound = Sounds[key];
        sound.name = key;
        sound.icon = 'volume-medium';
        if (sound.name !== 'nothing') {
          this.commands.push(sound);
        }
      });
    } else if (this.type === 'music') {
      this.placeholder = this.MANUAL.music;
      Object.keys(Musics).forEach((key) => {
        const music = Musics[key];
        music.name = key;
        music.icon = 'musical-notes';
        if (music.name !== 'nothing') {
          this.commands.push(music);
        }
      });
    } else if (this.type === 'ambiance') {
      this.placeholder = this.MANUAL.ambiance;
      Object.keys(Ambiances).forEach((key) => {
        const ambiance = Ambiances[key];
        ambiance.name = key;
        ambiance.icon = 'ear';
        if (ambiance.name !== 'nothing') {
          this.commands.push(ambiance);
        }
      });
    } else {
      Object.keys(Commands).forEach((key) => {
        this.commands.push(Commands[key]);
      });
    }
    this.commands.sort(this.sortByProp('name'));
    this.search();
  }

  getTraduction() {
    this.manualSub = this.translator.get('MODALS.MANUAL').subscribe((val) => {
      this.MANUAL = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
    this.commandSub = this.translator.get('COMMANDS').subscribe((val) => {
      this.COMMANDS = val;
    });
  }

  ngOnDestroy() {
    this.manualSub.unsubscribe();
    this.commonSub.unsubscribe();
    this.commandSub.unsubscribe();
  }

  search() {
    let res = [];
    if (this.filter === '') {
      res = this.commands;
    } else {
      this.commands.forEach((command: {name: string, desc: string, category: string, attribution: string}) => {
        let desc = false;
        let category = false;
        let attribution = false;
        if (this.COMMANDS[command.name]) {
          desc = this.COMMANDS[command.name].desc.toLowerCase().search(this.filter.toLowerCase()) !== -1;
        }
        if (command.category) {
          category = command.category.toLowerCase().search(this.filter.toLowerCase()) !== -1;
        }
        if (command.attribution) {
          attribution = command.attribution.toLowerCase().search(this.filter.toLowerCase()) !== -1;
        }
        if (command.name.toLowerCase().search(this.filter.toLowerCase()) !== -1 || desc || category || attribution) {
          res.push(command);
        }
      });
    }
    this.results = res;
  }

  sortByProp(prop) {
    return (a, b) => {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
          return -1;
      }
      return 0;
    };
  }

  cancel(data = {}) {
    this.modalCtrl.dismiss(data);
  }

  async showCommand(command: Command) {
    if (this.type === 'sound') {
      this.mediaService.loadSounds([command.name]);
      this.mediaService.playSound(command.name);
    }
    if (this.type === 'music') {
      this.mediaService.loadMusics([command.name]);
      this.mediaService.playMusic(command.name);
    }
    if (this.type === 'ambiance') {
      this.mediaService.loadAmbiances([command.name]);
      this.mediaService.playAmbiance(command.name);
    }
    const inputs = [];
    if (command.args) {
      for (const arg of command.args) {
        if (typeof arg.type === 'string') {
          // const input = {
          //   name: arg.name,
          //   placeholder: this.MANUAL.args[arg.name],
          //   type: arg.type
          // };
          // inputs.push(input);
        } else {
          for (const type of arg.type) {
            const input = {
              name: type,
              label: this.MANUAL.types[type],
              type: 'radio'
            };
            inputs.push(input);
          }
        }
      }
    }
    if (command.args) {
      const modal = await this.modalController.create({
      component: CommandEntriesComponent,
      componentProps: { name: command.name, inputs: command.args }
      });
      await modal.present();
      const outputs = await modal.onDidDismiss();
      if (outputs.data !== undefined) {
        const args = outputs.data.join(' ');
        const data = '/' + command.name + ' ' + args;
        await this.modalCtrl.dismiss(data);
        this.cancel(data);
      }
    } else {
      this.modalCtrl.dismiss('/' + command.name);
    }
    if (this.type === 'sound') {
      this.mediaService.stopSound();
    }
    if (this.type === 'music') {
      this.mediaService.stopMusic();
    }
    if (this.type === 'ambiance') {
      this.mediaService.stopAmbiance();
    }
  }

  toList(list: any[], title: string) {
    let res = title + ':<br><ul>';
    list.forEach((opt) => {
      res += '<li>' + opt + '</li>';
    });
    res += '</ul>';
    return res;
  }

  async forgotEntryAlert() {
    const alert = await this.alertController.create({
      message: this.MANUAL.forgotEntry,
      buttons: [this.COMMON.ok]
    });
    await alert.present();
  }
}
