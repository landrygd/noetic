import { ModalController } from '@ionic/angular';
import { ActorProfileComponent } from 'src/app/components/modals/actor-profile/actor-profile.component';
import { BookService } from 'src/app/services/book.service';
import { ActorService } from 'src/app/services/book/actor.service';
import { Component, OnInit } from '@angular/core';

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
    component: ActorProfileComponent,
    componentProps: { actorId }
    });
    await modal.present();
  }

  newActor() {
    this.actorService.newActor();
  }
}
