import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController } from '@ionic/angular';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    public firebase: FirebaseService,
    public modalController: ModalController
    ) { }

  ngOnInit() {
  }

  logout() {
    this.firebase.logout();
  }

  async changeAvatar() {
    const modal = await this.modalController.create({
      component: UploadComponent,
      componentProps: {
        type: 'userAvatar'
      }
    });
    return await modal.present();
  }
}
