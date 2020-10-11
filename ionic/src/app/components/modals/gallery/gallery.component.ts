import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {

  images: string[];

  constructor(
    private bookService: BookService,
    private modalController: ModalController
    ) { }

  async ngOnInit() {
    this.images = await this.bookService.getUploadedImages();
  }

  dismiss(data?) {
    this.modalController.dismiss(data);
  }

  onSearchChange(filter) {

  }
}
