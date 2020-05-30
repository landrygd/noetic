import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallpapers-search',
  templateUrl: './wallpapers-search.component.html',
  styleUrls: ['./wallpapers-search.component.scss'],
})
export class WallpapersSearchComponent implements OnInit, OnDestroy {

  wallpapers: any[] = [];

  WALLPAPER: any;

  wallpaperSub: Subscription;

  constructor(
    private mediaService: MediaService,
    private modalController: ModalController,
    private translator: TranslateService
    ) {
    this.wallpapers = this.mediaService.getWallpaperList();
  }

  async ngOnInit() {
    this.getTraduction();
  }

  getTraduction() {
    this.wallpaperSub = this.translator.get('MODALS.WALLPAPER').subscribe((val) => {
      this.WALLPAPER = val;
    });
  }

  ngOnDestroy() {
    this.wallpaperSub.unsubscribe();
  }

  cancel() {
    this.modalController.dismiss();
  }

  choose(name) {
    this.modalController.dismiss({name});
  }
}
