import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BookService } from '../book.service';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotifService {

  userId: string;

  constructor(
    private firestore: AngularFirestore,
    private bookService: BookService,
    private localNotifications: LocalNotifications
  ) {
    // this.userNotifs = this.firestore.collection('users').doc(this.userId).collection('notifs');
    // this.userId = this.authService.userId;
   }

  sendNotif(type, userId, bookId) {
    const id = this.firestore.createId();
    if (['invBook', 'acceptedInvBook'].includes(type)) {
      this.firestore.collection('users').doc(userId)
                    .collection('notifs').doc(id).set({id, type, user: this.bookService.userService.userId, book: bookId});
    }
  }

  inviteBook(userId, bookId) {
    this.sendNotif('invBook', userId, bookId);
  }

  eraseNotif(index) {
    this.firestore.collection('users').doc(this.bookService.userService.userId).collection('notifs').doc(index).delete();
  }

  getNotif() {
    return this.firestore.collection('users').doc(this.bookService.userService.userId).collection('notifs').valueChanges();
  }

  acceptInvitation(userId, bookId) {
    // On ajoute la ref du livre
    this.bookService.userService.addBookRef(bookId);
    // On envoie une notif informative de la confirmation
    this.sendNotif('acceptedInvBook', userId, bookId);
    // On ajoute l'autheur dans le livre
    this.bookService.addAuthor(bookId);
  }
}
