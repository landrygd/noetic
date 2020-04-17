import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-card-book',
  templateUrl: './card-book.component.html',
  styleUrls: ['./card-book.component.scss'],
})
export class CardBookComponent implements OnInit {

  @Input() json: object;

  name:string;
  desc:string;
  cover:string = "../../../assets/cover/cover1.png";

  constructor(public firebase: FirebaseService) {}

  ngOnInit() {
    this.name = this.json['name'];
    this.desc = this.json['desc'];
    this.cover = this.json['cover'];
  }

  open() {
    this.firebase.openCover(this.json);
  }

}
