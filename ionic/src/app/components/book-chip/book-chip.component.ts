import { Component, OnInit, Input } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book-chip',
  templateUrl: './book-chip.component.html',
  styleUrls: ['./book-chip.component.scss'],
})
export class BookChipComponent implements OnInit {
  @Input() bookId: string;

  bookObservable: Observable<unknown>;

  constructor(
    private bookService: BookService
    ) {}

  ngOnInit() {
    this.bookObservable = this.bookService.getBook(this.bookId);
  }

  openBook() {
    this.bookService.openCover(this.bookId);
  }
}
