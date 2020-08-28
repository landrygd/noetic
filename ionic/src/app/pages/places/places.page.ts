import { PlaceService } from './../../services/book/place.service';
import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { ModalController } from '@ionic/angular';
import { EntityModalComponent } from 'src/app/components/modals/entity-modal/entity-modal.component';

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {

  constructor(
    public placeService: PlaceService,
    public bookService: BookService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  newPlace() {
    this.bookService.newEntity('places', {items: []});
  }

  async showPlace(id: string) {
    const modal = await this.modalController.create({
    component: EntityModalComponent,
    componentProps: {type: 'place', id}
    });
    await modal.present();
  }
}
