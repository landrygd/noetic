import { BookService } from 'src/app/services/book.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs-book',
  templateUrl: './tabs-book.page.html',
  styleUrls: ['./tabs-book.page.scss'],
})
export class TabsBookPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public bookService: BookService
  ) {
    if (this.bookService.curBookId === undefined) {
      this.navCtrl.navigateRoot('/');
    }
   }

  ngOnInit() {
  }

  settings() {
    this.navCtrl.navigateForward('settings-book');
  }

}
