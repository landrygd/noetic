import { Component, OnInit, Input } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-id-finder',
  templateUrl: './id-finder.component.html',
  styleUrls: ['./id-finder.component.scss'],
})
export class IdFinderComponent implements OnInit {

  @Input() collection: string;
  @Input() exclude: string[] = [];

  results: any[];

  constructor(
    public bookService: BookService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.onSearchChange('');
  }

  onSearchChange(filter) {
    this.results = [];
    const collection = this.bookService.getEntitiesCollection(this.collection);
    const entities: {name: string}[] = this.bookService.objectToList(collection, this.exclude);
    if (filter === '') {
      this.results = entities;
    } else {
      for (const entity of entities) {
        if (entity.name.includes(filter)) {
          this.results.push(entity);
        }
      }
    }
  }

  dismiss(data = {}) {
    this.modalController.dismiss(data);
  }

}
