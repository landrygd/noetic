import { Injectable } from '@angular/core';
import { BookService } from '../book.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    public translator: TranslateService,
    private firestore: AngularFirestore,
    private bookService: BookService
  ) { }

  addPlace(place: {id: string, name: string, role: string[]}) {
    this.firestore.collection('/books').doc(this.bookService.curBookId).collection('items').doc(place.id).set(place);
  }

  removePlace(placeId: string) {
    this.firestore.collection('/books').doc(this.bookService.curBookId).collection('items').doc(placeId).delete();
  }

  updatePlace(placeId: string, placeVal: any) {
    this.firestore.collection('/books').doc(this.bookService.curBookId).collection('items').doc(placeId).update(placeVal);
  }

  async newItem() {
    this.bookService.newEntity('places');
  }
}
