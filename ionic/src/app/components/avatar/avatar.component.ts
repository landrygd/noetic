import { Component, OnInit, Input } from '@angular/core';
import { ActorService } from 'src/app/services/book/actor.service';
import { ActorProfileComponent } from '../modals/actor-profile/actor-profile.component';
import { ModalController } from '@ionic/angular';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})

export class AvatarComponent implements OnInit {

  @Input() actorId: string;
  @Input() enabled = false;
  @Input() height = 40;

  actor: string;

  constructor(
    public actorService: ActorService,
    public bookService: BookService,
    private modalController: ModalController
    ) {
  }

  ngOnInit() {}


  async viewProfile(actorId: string = this.actorId) {
    if (this.enabled) {
      const modal = await this.modalController.create({
      component: ActorProfileComponent,
      componentProps: { actorId }
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
