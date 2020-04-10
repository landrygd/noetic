import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-card-book',
  templateUrl: './card-book.component.html',
  styleUrls: ['./card-book.component.scss'],
})
export class CardBookComponent implements OnInit {

  @Input() name: string;
  @Input() id: string;

  constructor(public firebase: FirebaseService, public navCtrl: NavController) { }

  ngOnInit() {}

  open() {
    this.firebase.openBook(this.id);
  }

}
