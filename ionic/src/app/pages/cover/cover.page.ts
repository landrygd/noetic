import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';

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
  vote: number;
  id: string; // book id
  url: string;
  authorsId: any[] = [];
  authors: any[] = [];
  com: any[] = [];
  tags: any[] = [];

  comment = {
    userId: this.firebase.userId,
    text: "",
    rate: 0,
    date: 0
  }

  commented = false;
  lastRate = 0;

  constructor(public firebase: FirebaseService, public navCtrl: NavController) { }

  ngOnInit() {
    this.name = this.firebase.book.name;
    this.tags = this.firebase.book.tags;
    this.desc = this.firebase.book.desc;
    this.star = this.firebase.book.star;
    this.view = this.firebase.book.view;
    this.vote = this.firebase.book.vote;
    this.id = this.firebase.book.id;
    this.url = this.firebase.book.cover;
    this.authorsId = this.firebase.book.authors;
    this.authorsId.forEach((author)=>{
      this.firebase.getUserById(author).subscribe((value)=>this.authors.push(value.data()));
    });
    this.firebase.syncComments(this.id);
    this.firebase.haveCommented(this.id).subscribe((value)=>{
      if(value.data()) {
        this.comment = value.data();
        this.commented = true;
        this.lastRate = this.comment.rate;
      }
    })
  }

  play() {
    this.firebase.play(this.id);
  }

  edit() {
    this.firebase.openBook(this.id);
  }

  back() {
    this.firebase.unsyncComments();
    this.navCtrl.back();
  }

  // authorsToString() {
  //   let res:string = "";
  //   res = this.authors.join(', ');
  //   res = res.replace(/,(?=[^,]*$)/, ' et');
  //   return res;
  // }

  isAuthor() {
    return this.authorsId.includes(this.firebase.userId);
  }

  getStars() {
    return new Array(Math.round(this.star/Math.max(1,this.vote)));
  }

  getStarColor(index) {
    if(index<this.comment.rate) {
      return "primary";
    }
    return "medium";
  }

  setRate(index) {
    this.comment.rate = index+1;
  }

  send() {
    const date = Date.now();
    this.comment.date = date;
    if(this.comment.rate !== 0 ) {
      this.firebase.addComment(this.comment, this.id, this.commented, this.lastRate);
    }
  }

  starToArray(star) {
    return new Array(star);
  }

  enter(keyCode) {
    if (keyCode == 13) {
      this.send();
    }
  }
}
