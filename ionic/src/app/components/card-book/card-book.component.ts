import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Directive } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Animation, AnimationController } from '@ionic/angular';
import { AnimationService } from 'src/app/services/animation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-book',
  templateUrl: './card-book.component.html',
  styleUrls: ['./card-book.component.scss'],
})
export class CardBookComponent implements OnInit, AfterViewInit {

  @Input() bookId: string;

  bookAsync: Observable<any>;

  @ViewChild('ref', { read: ElementRef, static: true}) ref: ElementRef;
  @ViewChild('image', { read: ElementRef, static: true}) image: ElementRef;

  loading = true;

  title: string;
  desc: string;
  cover = '../../../assets/cover/cover1.png';

  constructor(
    public firebase: FirebaseService,
    public animation: AnimationService
    ) {}

  ngOnInit() {
    this.bookAsync = this.firebase.getBook(this.bookId);
  }

  ngAfterViewInit() {
    this.animation.fadeIn(this.ref);
  }

  open(json) {
    this.firebase.openCover(json);
  }
}
