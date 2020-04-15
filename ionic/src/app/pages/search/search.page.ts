import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  search: any[] = [];

  constructor(public firebase: FirebaseService) { }

  ngOnInit() {
  }

  onSearchChange(event){
    const filter = event.target.value
    this.search = this.firebase.search(filter);
  }

  open(json) {
    this.firebase.openCover(json);
  }
}
