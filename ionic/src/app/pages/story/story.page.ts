import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage implements OnInit {

  chats: any[];

  constructor(
    public navCtrl: NavController,
    public bookService: BookService
    ) {
      if (this.bookService.curBookId === undefined) {
        this.navCtrl.navigateRoot('/');
      }
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

  settings() {
    this.navCtrl.navigateForward('settings-book');
  }
}
