import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NavController, IonSearchbar } from '@ionic/angular';
import { SlidesService } from 'src/app/services/slides.service';
import { AnimationService } from 'src/app/services/animation.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.page.html',
  styleUrls: ['./book-search.page.scss'],
})
export class BookSearchPage implements OnInit {

  @ViewChild('searchBar', { read: IonSearchbar, static: true}) searchBar: IonSearchbar;

  filter = '';

  resultsByName: Observable<any>;
  resultsByTag: Observable<any>;
  resultsByNameSub: Subscription = new Subscription();
  resultsByTagSub: Subscription = new Subscription();


  books: any[] = [];

  loading = true;

  constructor(
    public bookService: BookService,
    private navCtrl: NavController,
    public slides: SlidesService,
    private animation: AnimationService
    ) { }

  ngOnInit() {
    setTimeout(() => this.searchBar.setFocus(), 200);
  }

  async search() {
    let books = [];
    await this.searchByName().then((val) => books = books.concat(val));
    await this.searchByTag().then((val) => books = books.concat(val));
    if (JSON.stringify(this.books) !== JSON.stringify(books)) {
      this.books = books;
    }
    this.loading = false;
  }

  searchByName(): Promise<any> {
    return new Promise(res => {
      if (!this.resultsByNameSub.closed) {
        this.resultsByNameSub.unsubscribe();
      }
      this.resultsByName = this.bookService.searchByName(this.filter);
      this.resultsByNameSub = this.resultsByName.subscribe((val) => {
          res(val);
      });
    });
  }

  searchByTag(): Promise<any> {
    return new Promise(res => {
      if (!this.resultsByTagSub.closed) {
        this.resultsByTagSub.unsubscribe();
      }
      this.resultsByTag = this.bookService.searchByTag(this.filter);
      this.resultsByTagSub = this.resultsByTag.subscribe((val) => {
          res(val);
      });
    });
  }

  cancel() {
    this.navCtrl.navigateBack('tabs/home');
  }

}
