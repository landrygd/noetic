import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { BookService } from '../book.service';
import { UserService } from '../user.service';
import { Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  comments: any[] = [];
  commentsSub: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private bookService: BookService,
    private userService: UserService
  ) { }

  addComment(comment, bookId, commented= false, lastRate= 0) {
    let stars = this.bookService.book.stars + comment.rate;
    let votes = this.bookService.book.votes;
    if (commented) {
      stars -= lastRate;
    } else {
      votes += 1 ;
    }
    const starsAvg = stars / Math.max(votes, 1);
    this.firestore.collection('books').doc(bookId).update({
      votes,
      stars,
      starsAvg
    });
    this.firestore.collection('books').doc(bookId).collection('comments').doc(this.userService.userId).set(comment);
    // Enregistrement de la référence dans l'utilisateur
    this.firestore.collection('users').doc(this.userService.userId).collection('comments').doc(bookId).set({});
  }

  answerToComment(bookId, userId, answer) {
    this.firestore.collection('books').doc(bookId).collection('comments').doc(userId).update({answer});
  }

  deleteComment(bookId) {
    this.firestore.collection('books').doc(bookId).collection('comments').doc(this.userService.userId).delete();
  }

  syncComments(bookId) {
    this.commentsSub = this.firestore.collection('books').doc(bookId)
                                     .collection('comments', ref => ref.limit(10)).snapshotChanges().subscribe((value) => {
      this.comments = [];
      value.forEach(data => {
        const comment = data.payload.doc.data();
        this.comments.push(comment);
      });
      this.comments.forEach((comment) => {
        comment.user = this.userService.getUser(comment.userId);
      });
    });
  }

  unsyncComments() {
    this.commentsSub.unsubscribe();
  }

  haveCommented(bookId = this.bookService.curBookId): Observable<DocumentChangeAction<firebase.firestore.DocumentData>[]> {
    return this.firestore.collection('books').doc(bookId)
                         .collection('comments', ref => ref.where('userId', '==', this.userService.userId)).snapshotChanges();
  }
}
