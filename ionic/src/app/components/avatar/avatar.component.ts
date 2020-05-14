import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';
import { ActorService } from 'src/app/services/book/actor.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})

export class AvatarComponent implements OnInit {

  @Input() set actorId(actorId: string) {
    this.actor = this.actorService.getActor(actorId);
    if (this.actor.hasOwnProperty('name')) {
      this.name = this.actor.name;
    }
    if (this.actor.hasOwnProperty('color')) {
      this.color = this.actor.color;
    }
    if (this.actor.hasOwnProperty('avatar')) {
      this.avatar = this.actor.avatar;
    }
  } // identifiant de l'acteur

  actor: any;
  name = 'unknown';
  color = 'rgb(56, 128, 255)';
  avatar = 'assets/avatar/man.png';

  constructor(public actorService: ActorService) {
  }

  ngOnInit() {}



  haveAvatar() {
    return this.actor.hasOwnProperty('avatar');
  }

  getInitial() {
    let res = '';
    if (this.name !== '') {
      const tab = this.name.split(' ');
      let i = 0;
      while (i < Math.min(tab.length, 2)) {
        res += tab[i][0];
        i++;
      }
    }
    return res.toUpperCase();
  }

}
