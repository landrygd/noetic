import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  ownUserId: string;
  booksCollection: AngularFirestoreCollection<any>;

  constructor(
    private firestore: AngularFirestore,
    private firebase: FirebaseService
  ) {
    this.booksCollection = this.firestore.collection('books');
    this.ownUserId = firebase.userId;
   }

  getBooks(bookIdArray: any[]): Observable<any> {
    if (bookIdArray.length > 0 ) {
      return this.firestore.collection('books', ref => ref.where('id', 'in', bookIdArray)).valueChanges();
    } else {
      return new Observable<any>();
    }
  }
}
