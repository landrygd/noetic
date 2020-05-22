import { Component, OnInit } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-wallpapers-search',
  templateUrl: './wallpapers-search.component.html',
  styleUrls: ['./wallpapers-search.component.scss'],
})
export class WallpapersSearchComponent implements OnInit {

  wallpapers: any[] = [];

  constructor(
    private mediaService: MediaService,
    private modalController: ModalController
    ) {
    this.wallpapers = this.mediaService.getWallpaperList();
  }

  ngOnInit() {}

  cancel() {
    this.modalController.dismiss();
  }

  choose(name) {
    this.modalController.dismiss({name});
  }
}
