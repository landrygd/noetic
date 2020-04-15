import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.page.html',
  styleUrls: ['./cover.page.scss'],
})
export class CoverPage implements OnInit {

  name:string;
  desc: string;
  star: number;
  view: number;
  id: string;

  constructor(public firebase: FirebaseService) { }

  ngOnInit() {
    this.name = this.firebase.book.name;
    this.desc = this.firebase.book.desc;
    this.star = this.firebase.book.star;
    this.view = this.firebase.book.view;
    this.id = this.firebase.book.id;
  }

  play() {
    console.log(this.id);
    this.firebase.play(this.id);
  }
}
