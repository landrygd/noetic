import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SlidesService } from 'src/app/services/slides.service';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  curCategory = 'undefined';

  mostVueList: Observable<any>;
  mostRecentList: Observable<any>;
  topRatedList: Observable<any>;

  userBookList: string[] = [];

  constructor(
    public userService: UserService,
    public books: BookService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public slides: SlidesService
    ) {
    this.mostVueList = this.books.getMostVue();
    this.mostRecentList = this.books.getMostRecent();
    this.topRatedList = this.books.getTopRated();
   }

  ngOnInit() {}

  search() {
    this.navCtrl.navigateForward('profile', {queryParams: {id: 'testId'}});
    // this.navCtrl.navigateForward('book-search');
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
