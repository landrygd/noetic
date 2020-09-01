import { ModalController } from '@ionic/angular';
import { BookService } from 'src/app/services/book.service';
import { ActorService } from 'src/app/services/book/actor.service';
import { Component, OnInit } from '@angular/core';
import { EntityModalComponent } from 'src/app/components/modals/entity-modal/entity-modal.component';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.page.html',
  styleUrls: ['./actors.page.scss'],
})
export class ActorsPage implements OnInit {

  constructor(
    public bookService: BookService,
    private modalController: ModalController,
    private actorService: ActorService
    ) { }

  ngOnInit() {
    console.log(this.bookService.actors);
  }

  async viewProfile(actorId: string) {
    const modal = await this.modalController.create({
    component: EntityModalComponent,
    componentProps: { id: actorId, collection: 'actors' }
    });
    await modal.present();
  }

  newActor() {
    this.bookService.newEntity('actors');
  }
}
