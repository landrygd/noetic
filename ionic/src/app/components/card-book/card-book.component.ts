import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Directive } from '@angular/core';
import { AnimationService } from 'src/app/services/animation.service';
import { Observable } from 'rxjs';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/classes/book';

@Component({
  selector: 'app-card-book',
  templateUrl: './card-book.component.html',
  styleUrls: ['./card-book.component.scss'],
})
export class CardBookComponent implements OnInit, AfterViewInit {

  @Input() book: Book;

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

  constructor(
    public bookService: BookService,
    public animation: AnimationService
    ) {}

  ngOnInit() {

    this.width = this.height * 9 / 16;
  }

  ngAfterViewInit() {
    this.animation.fadeIn(this.ref);
  }

  open() {
    this.bookService.showBook(this.book);
  }
}
