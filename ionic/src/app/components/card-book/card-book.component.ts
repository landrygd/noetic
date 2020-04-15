import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-book',
  templateUrl: './card-book.component.html',
  styleUrls: ['./card-book.component.scss'],
})
export class CardBookComponent implements OnInit {

  cover=''

  @Input() name: string;

  constructor() {}

  ngOnInit() {}

}
