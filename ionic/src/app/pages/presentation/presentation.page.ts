import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.page.html',
  styleUrls: ['./presentation.page.scss'],
})
export class PresentationPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  start() {
    this.navCtrl.navigateRoot('/tabs');
  }
}
