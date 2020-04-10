import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController } from '@ionic/angular';
import { NewBookComponent } from 'src/app/components/modals/new-book/new-book.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public firebase: FirebaseService, public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async addBook() {
    const modal = await this.modalCtrl.create({
      component: NewBookComponent
    });
    return await modal.present();
  }
  
  logout() {
    this.firebase.logout();
  }
}
