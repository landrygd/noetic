import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.scss'],
})
export class UploadComponent implements OnInit {

  @Input() type = '';

  path = 'unknowed';
  userId: string;
  file: any;
  ratio = 1;
  width = 200;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  imported = false;

  constructor(
    private modalController: ModalController,
    public userService: UserService,
    public bookService: BookService
    ) {
  }

  ngOnInit() {
    if (this.type === 'cover') {
      this.ratio = 9 / 16;
      this.width = 180;
    }
  }

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
      this.imported = true;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.file = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  cancel() {
    this.modalController.dismiss();
  }

  confirm() {
    if (this.type === 'userAvatar') {
      this.userService.uploadAvatar(this.file);
    }
    this.modalController.dismiss(this.file);
  }
}
