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

  async newPlace() {
    await this.bookService.newEntity('place');
    this.refresh();
  }

  async showPlace(key: string) {
    const modal = await this.modalController.create({
    component: EntityModalComponent,
    componentProps: { entity: this.bookService.book.getEntity(key) }
    });
    await modal.present();
    await modal.onDidDismiss();
    this.refresh();
  }
}
