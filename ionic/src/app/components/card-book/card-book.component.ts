import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Directive, OnChanges } from '@angular/core';
import { AnimationService } from 'src/app/services/animation.service';
import { Observable } from 'rxjs';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/classes/book';

@Component({
  selector: 'app-card-book',
  templateUrl: './card-book.component.html',
  styleUrls: ['./card-book.component.scss'],
})
export class CardBookComponent implements OnInit, OnChanges {

  @Input() book: Book;
  @Input() id: string;

  @Input() height = 200;
  width: number;

  bookAsync: Observable<any>;

  @ViewChild('ref', { read: ElementRef, static: true}) ref: ElementRef;
  @ViewChild('image', { read: ElementRef, static: true}) image: ElementRef;

  loading = true;

  title: string;
  desc: string;
  cover = '../../../assets/cover/cover1.png';
  async = false;
  loadFailed = false;

  constructor(
    public bookService: BookService,
    public animation: AnimationService
    ) {}

  ngOnChanges() {
  }

  async ngOnInit() {
    if (this.id) {
      this.book = await this.bookService.getBook(this.id);
    }
    this.loading = false;
    this.width = this.height * 9 / 16;
    this.animation.fadeIn(this.ref);
  }

  open() {
    this.bookService.showBook(this.book);
  }

  onImgLoadFailed() {
    this.loadFailed = true;
    this.onImgLoaded();
  }

  onImgLoaded() {
    this.loading = false;
  }
  popupInteractive() {
    this.bookService.popupInteractive();
  }

}
