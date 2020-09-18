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

  places: any[];

  constructor(
    public bookService: BookService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.places = this.bookService.book.getEntities('place');


  }

  newPlace() {
    this.bookService.newEntity('places', {items: []});
  }

  async showPlace(key: string) {
    const modal = await this.modalController.create({
    component: EntityModalComponent,
    componentProps: {collection: 'places', key}
    });
    await modal.present();
  }
}
