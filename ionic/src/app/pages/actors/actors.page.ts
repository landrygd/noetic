import { ModalController } from '@ionic/angular';
import { BookService } from 'src/app/services/book.service';
import { Component, OnInit } from '@angular/core';
import { EntityModalComponent } from 'src/app/components/modals/entity-modal/entity-modal.component';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.page.html',
  styleUrls: ['./actors.page.scss'],
})
export class ActorsPage implements OnInit {

  actors: any[];

  constructor(
    public bookService: BookService,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.actors = this.bookService.book.getEntities(['actor']);
  }

  async viewProfile(key: string) {
    const modal = await this.modalController.create({
    component: EntityModalComponent,
    componentProps: { entity: this.bookService.book.getEntity(key) }
    });
    await modal.present();
    await modal.onDidDismiss();
    this.refresh();
  }

  async newActor() {
    await this.bookService.newEntity('actor');
    this.refresh();
  }
}
