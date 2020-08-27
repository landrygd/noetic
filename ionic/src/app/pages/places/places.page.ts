import { ModalController } from '@ionic/angular';
import { PlaceService } from './../../services/book/place.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {

  constructor(
    public placeService: PlaceService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  newPlace() {
    this.placeService.newPlace();
  }

}
