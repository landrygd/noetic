import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NavController, IonSearchbar } from '@ionic/angular';
import { SlidesService } from 'src/app/services/slides.service';
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
  category = "";
  option = "likes";

  constructor(
    public bookService: BookService,
    private navCtrl: NavController,
    public slides: SlidesService,
    ) { }

  ngOnInit() {
    setTimeout(() => this.searchBar.setFocus(), 200);
  }

  async search() {
    this.category = "";
    let books = [];
    await this.searchByName().then((val) => books = books.concat(val));
    await this.searchByTag().then((val) => books = books.concat(val));
    if (JSON.stringify(this.books) !== JSON.stringify(books)) {
      this.books = books;
    }
    this.loading = false;
  }

  searchByName(): Promise<any> {
    return new Promise((resolve) => {
      resolve(this.bookService.searchByName(this.filter, this.option));
    });
  }

  searchByTag(): Promise<any> {
    return new Promise(resolve => {
      resolve(this.bookService.searchByTag(this.filter, this.option));
    });
  }

  async searchByCategory(category: string) {
    this.books = await this.bookService.searchByCategory(category);
    this.category = category;
    console.log(this.category);
    console.log(this.books);
    this.loading = false;
  }

  cancel() {
    this.navCtrl.navigateBack('tabs/home');
  }
}
