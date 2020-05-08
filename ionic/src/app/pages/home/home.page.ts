import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController, IonSlides, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SlidesService } from 'src/app/services/slides.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  curCategory = 'undefined';

  mostVueList: Observable<any>;
  userBookList: string[] = [];

  constructor(
    public firebase: FirebaseService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public slides: SlidesService
    ) {
    this.mostVueList = this.firebase.getMostVue();
    if (this.firebase.connected) {
      this.userBookList = this.firebase.userData.list;
    }
   }

  ngOnInit() {}

  search() {
    this.navCtrl.navigateForward('book-search');
  }
  // searchCategory(category) {
  //   this.curCategory = category;
  //   this.bookSearch = this.firebase.getCategory(category);
  // }

  // clearSearch() {
  //   this.curCategory = 'undefined';
  //   this.bookSearch = [];
  // }
}
