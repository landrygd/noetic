import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-card-book',
  templateUrl: './card-book.component.html',
  styleUrls: ['./card-book.component.scss'],
})
export class CardBookComponent implements OnInit {

  @Input() json: any;

  loading = true;

  title: string;
  desc: string;
  cover = '../../../assets/cover/cover1.png';

  constructor(public firebase: FirebaseService) {}

  ngOnInit() {
    this.title = this.json.title;
    this.desc = this.json.desc;
    this.cover = this.json.cover;
  }

  open() {
    this.firebase.openCover(this.json);
  }

}
