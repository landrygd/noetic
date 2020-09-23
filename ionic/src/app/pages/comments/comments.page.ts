import { Component, OnInit } from '@angular/core';
import { Comment } from 'src/app/classes/comment';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  comments: Comment[];

  constructor(public bookService: BookService) { }

  ngOnInit() {
  }

}
