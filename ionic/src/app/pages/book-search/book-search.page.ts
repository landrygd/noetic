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
  @ViewChild('loadingCardByNameView', { read: ElementRef, static: true}) loadingCardByNameView: ElementRef;

  filter = '';

  resultsByName: Observable<any>;
  resultsByTag: Observable<any>;
  resultsByNameSub: Subscription;
  resultsByTagSub: Subscription;


  books: any[] = [];

  loadingByName = true;
  loadingByTag = true;

  constructor(
    public bookService: BookService,
    private navCtrl: NavController,
    public slides: SlidesService,
    private animation: AnimationService
    ) { }

  ngOnInit() {
    setTimeout(() => this.searchBar.setFocus(), 200);
  }

  search() {
    this.searchByName();
  }

  searchByName() {
    if (this.resultsByNameSub) {
      this.resultsByNameSub.unsubscribe();
    }
    this.resultsByName = this.bookService.searchByName(this.filter);
    this.resultsByNameSub = this.resultsByName.subscribe((val) => {
      console.log(val);
      if (JSON.stringify(this.books) !== JSON.stringify(val)) {
        this.books = val;
      }
      this.loadingByName = false;
    });
    setTimeout(() => {
      if (this.loadingByName) {
        this.animation.fadeIn(this.loadingCardByNameView);
      }
    }, 500);
  }

  searchByTag() {
    if (this.resultsByNameSub) {
      this.resultsByNameSub.unsubscribe();
    }
    this.resultsByTag = this.bookService.searchByTag(this.filter);
    this.resultsByTagSub = this.resultsByTag.subscribe((val) => {
      console.log(val);
      if (JSON.stringify(this.books) !== JSON.stringify(val)) {
        this.books = val;
      }
      this.loadingByTag = false;
    });
    setTimeout(() => {
      if (this.loadingByTag) {
        // this.animation.fadeIn(this.loadingCard);
      }
    }, 500);
  }

  cancel() {
    this.navCtrl.navigateBack('tabs/home');
  }

}
