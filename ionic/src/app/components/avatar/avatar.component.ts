import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BookService } from 'src/app/services/book.service';
import { EntityModalComponent } from '../modals/entity-modal/entity-modal.component';
import { Entity } from 'src/app/classes/book';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})

export class AvatarComponent implements OnInit {

  @Input() enabled = false;
  @Input() height = 40;
  @Input() entity;

  actor: string;

  constructor(
    public bookService: BookService,
    private modalController: ModalController
    ) {
  }

  ngOnInit() {
  }

  async viewProfile() {
    if (this.enabled) {
      const modal = await this.modalController.create({
      component: EntityModalComponent,
      componentProps: { entity: this.entity }
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
