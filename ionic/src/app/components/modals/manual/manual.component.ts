import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import Commands from '../../../../assets/json/commands.json';
import Sounds from '../../../../assets/json/sounds.json';
import Musics from '../../../../assets/json/musics.json';
import Ambiances from '../../../../assets/json/ambiances.json';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss'],
})
export class ManualComponent implements OnInit {

  @Input() type: string;

  commands = [];

  filter = '';

  results = [];

  placeholder = 'Chercher une commande';

  constructor(private modalCtrl: ModalController, private alertController: AlertController, private mediaService: MediaService) { }

  ngOnInit() {
    if (this.type === 'sound') {
      this.placeholder = 'Chercher un bruitage';
      Object.keys(Sounds).forEach((key) => {
        const sound = Sounds[key];
        sound.name = key;
        sound.icon = 'volume-medium';
        if (sound.name !== 'nothing') {
          this.commands.push(sound);
        }
      });
    } else if (this.type === 'music') {
      this.placeholder = 'Chercher une musique';
      Object.keys(Musics).forEach((key) => {
        const music = Musics[key];
        music.name = key;
        music.icon = 'musical-notes';
        if (music.name !== 'nothing') {
          this.commands.push(music);
        }
      });
    } else if (this.type === 'ambiance') {
      this.placeholder = 'Chercher une ambiance';
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

  search() {
    let res = [];
    if (this.filter === '') {
      res = this.commands;
    } else {
      this.commands.forEach((command: {name: string, desc: string, category: string, attribution: string}) => {
        let desc = false;
        let category = false;
        let attribution = false;
        if (command.desc) {
          desc = command.desc.search(this.filter) !== -1;
        }
        if (command.category) {
          category = command.category.search(this.filter) !== -1;
        }
        if (command.attribution) {
          attribution = command.attribution.search(this.filter) !== -1;
        }
        if (command.name.search(this.filter) !== -1 || desc || category || attribution) {
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

  cancel() {
    this.modalCtrl.dismiss();
  }

  async showCommand(command: any) {
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
    let message = '';
    if (command.opts) {
      message += this.toList(command.opts, 'Options') + '<br>';
    }
    if (command.ex) {
      message += this.toList(command.ex, 'Exemples');
    }
    if (command.category) {
      message += 'Catégorie: ' + command.category + '<br>';
    }
    if (command.attribution) {
      message += command.attribution;
    }
    const alert = await this.alertController.create({
      header: command.name,
      subHeader: command.desc,
      message,
      buttons: [
        {
          text: 'Retour',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Utiliser',
          handler: () => {
            if (this.type === '') {
              this.modalCtrl.dismiss({command: command.ex[0]});
            } else {
              this.modalCtrl.dismiss({command: '/' + this.type + ' ' + command.name});
            }
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss();
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
}
