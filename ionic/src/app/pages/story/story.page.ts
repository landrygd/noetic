import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage implements OnInit {

  chats: any[];

  constructor(
    public bookService: BookService
    ) {
      this.chats = this.bookService.chats;
  }

  ngOnInit() {
  }

  addChat() {
    this.bookService.newChat();
  }

  openChat(chatId) {
    this.bookService.openChat(chatId);
  }
}
