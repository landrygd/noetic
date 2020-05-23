import { Injectable } from '@angular/core';
import Wallpapers from '../../assets/json/wallpapers.json';
import Sounds from '../../assets/json/sounds.json';
import Ambiances from '../../assets/json/ambiances.json';
import Musics from '../../assets/json/musics.json';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  sounds: any = {};
  ambiances: any = {};
  musics: any = {};

  curMusic = 'all';

  constructor(private firestorage: AngularFireStorage) {}

  private async getMusicsJSON() {
    const categories = [
      'adventure',
      'battle',
      'hardrock',
      'horror',
      'medieval',
      'percussion',
      'rock',
      'space'
    ];
    const res = {};
    categories.forEach(category => {
      [1, 2, 3, 4, 5].forEach(async (index) => {
        const obj = {
          url: '',
          category,
          attribution: 'By Andy Ray'
        };
        const musicName = category + index;
        const url = await this.firestorage.ref('lib/musics/' + category + '/' + musicName + '.mp3')
        .getDownloadURL().toPromise();
        obj.url = url;
        res[musicName] = obj;
        console.log(res);
      });
    });
  }

  private async getAmbiancesJSON() {
    const categories = [
      'alarm',
      'battle',
      'city',
      'machines',
      'nature',
      'scifi',
      'transport',
    ];
    const res = {};
    categories.forEach(async category => {
      const folder = this.firestorage.ref('lib/ambiances/' + category);
      const files = await folder.listAll().toPromise();
      files.items.forEach(async file => {
        const obj = {
          url: '',
          category,
          attribution: 'By Imphenzi'
        };
        const ambianceName = file.name;
        const url = await this.firestorage.ref('lib/ambiances/' + category + '/' + ambianceName)
        .getDownloadURL().toPromise();
        obj.url = url;
        res[ambianceName.replace('.wav', '')] = obj;
      });
    });
  }

  getWallpaperURL(name) {
    return Wallpapers[name].url;
  }

  getWallpaperList() {
    const res = [];
    // tslint:disable-next-line: forin
    for (const name in Wallpapers) {
      const wallpaper = Wallpapers[name];
      wallpaper.name = name;
      res.push(wallpaper);
    }
    return res;
  }

  playSound(name) {
    if (this.sounds.hasOwnProperty(name)) {
      this.sounds[name].play();
    }
  }

  playMusic(name, loop = false) {
    this.stopMusic(this.curMusic);
    if (this.musics.hasOwnProperty(name)) {
      this.musics[name].loop = loop;
      this.musics[name].play();
    }
  }

  stopMusic(name = 'all') {
    if (name === 'all') {
      for (const musicName of Object.keys(this.musics)) {
        this.musics[musicName].pause();
        this.musics[musicName].currentTime = 0;
        this.curMusic = '';
      }
    } else {
      if (this.musics.hasOwnProperty(name)) {
        this.musics[name].pause();
        this.musics[name].currentTime = 0;
        this.curMusic = '';
      }
    }
  }

  playAmbiance(name) {
    if (this.ambiances.hasOwnProperty(name)) {
      this.ambiances[name].loop = true;
      this.ambiances[name].play();
    }
  }

  stopAmbiance(name = 'all') {
    if (name === 'all') {
      for (const ambianceName of Object.keys(this.ambiances)) {
        this.ambiances[ambianceName].pause();
        this.ambiances[ambianceName].currentTime = 0;
      }
    } else {
      if (this.ambiances.hasOwnProperty(name)) {
        this.ambiances[name].pause();
        this.ambiances[name].currentTime = 0;
      }
    }
  }

  stopSound(name = 'all') {
    if (name === 'all') {
      for (const soundName of Object.keys(this.sounds)) {
        this.sounds[soundName].pause();
        this.sounds[soundName].currentTime = 0;
      }
    } else {
      if (this.sounds.hasOwnProperty(name)) {
        this.sounds[name].pause();
        this.sounds[name].currentTime = 0;
      }
    }
  }

  loadSounds(soundArray: string[]) {
    for (const soundName of soundArray) {
      if (!Object.keys(this.sounds).includes(soundName)) {
        if (Object.keys(Sounds).includes(soundName)) {
          this.sounds[soundName] = new Audio();
          this.sounds[soundName].src = Sounds[soundName].url;
          this.sounds[soundName].load();
        }
      }
    }
  }

  loadMusics(musicArray: string[]) {
    for (const musicName of musicArray) {
      if (!Object.keys(this.musics).includes(musicName)) {
        if (Object.keys(Musics).includes(musicName)) {
          this.musics[musicName] = new Audio();
          this.musics[musicName].src = Musics[musicName].url;
          this.musics[musicName].load();
        }
      }
    }
  }

  loadAmbiances(ambiancesArray: string[]) {
    for (const ambianceName of ambiancesArray) {
      if (!Object.keys(this.ambiances).includes(ambianceName)) {
        if (Object.keys(Ambiances).includes(ambianceName)) {
          this.ambiances[ambianceName] = new Audio();
          this.ambiances[ambianceName].src = Ambiances[ambianceName].url;
          this.ambiances[ambianceName].load();
        }
      }
    }
  }

  // TODO
  // fadeInAudio(name: string, type = 'music') {
  //   audio.volume = 1
  // }
}
