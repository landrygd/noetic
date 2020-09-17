import { Component } from '@angular/core';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage {
  constructor(
    public bookService: BookService
    ) {}

  addChat() {
    // this.bookService.newChat();
  }

  openScript(scriptName) {
    this.bookService.openScript(scriptName);
  }
}
