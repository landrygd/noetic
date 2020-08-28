import { BookService } from 'src/app/services/book.service';
import { PopupService } from 'src/app/services/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(
    public translator: TranslateService,
    private firestore: AngularFirestore,
    private bookService: BookService
    ) {
  }


  addPlace(place: {id: string, name: string, role: string[]}) {
    this.firestore.collection('/books').doc(this.bookService.curBookId).collection('places').doc(place.id).set(place);
  }

  removePlace(placeId: string) {
    this.firestore.collection('/books').doc(this.bookService.curBookId).collection('places').doc(placeId).delete();
  }

  updatePlace(placeId: string, placeVal: any) {
    this.firestore.collection('/books').doc(this.bookService.curBookId).collection('places').doc(placeId).update(placeVal);
  }

  // async newPlace() {
  //   this.bookService.newEntity('place').then((place) => this.addPlace(place));
  // }
}
