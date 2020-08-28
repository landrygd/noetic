import { Component, OnInit, Input } from '@angular/core';
import { ActorService } from 'src/app/services/book/actor.service';
import { ModalController } from '@ionic/angular';
import { BookService } from 'src/app/services/book.service';
import { EntityModalComponent } from '../modals/entity-modal/entity-modal.component';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})

export class AvatarComponent implements OnInit {

  @Input() id: string;
  @Input() enabled = false;
  @Input() height = 40;
  @Input() type = 'actor';

  actor: string;

  constructor(
    public actorService: ActorService,
    public bookService: BookService,
    private modalController: ModalController
    ) {
  }

  ngOnInit() {}

  getColor(id: string) {
    if (this.bookService.entities[id].color) {
      return this.bookService.entities[id].color;
    } else {
      return 'medium';
    }
  }

  async viewProfile(id: string = this.id) {
    if (this.enabled) {
      const modal = await this.modalController.create({
      component: EntityModalComponent,
      componentProps: { id, type: this.type }
      });
      await modal.present();
    }
  }

  getInitial(name) {
    let res = '';
    if (name !== '') {
      const tab = name.split(' ');
      let i = 0;
      while (i < Math.min(tab.length, 2)) {
        res += tab[i][0];
        i++;
      }
    }
    return res.toUpperCase();
  }

}
