import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.page.html',
  styleUrls: ['./presentation.page.scss'],
})
export class PresentationPage implements OnInit {

  @ViewChild('slides', {static: true}) slides: IonSlides;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  start() {
    this.navCtrl.navigateRoot('/tabs');
  }

  next() {
    this.slides.slideNext();
  }
}
