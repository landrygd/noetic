import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';
import { ActorService } from 'src/app/services/book/actor.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.scss'],
})
export class UploadComponent implements OnInit {

  @Input() type = '';
  @Input() fileId = '';

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
    public bookService: BookService,
    public actorService: ActorService,
    private popupService: PopupService
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
      this.popupService.alert('Erreur de chargement de l\'image. Veuillez vérifier si elle est bien au format .jpeg ou .png.');
  }

  cancel() {
    this.modalController.dismiss();
  }

  confirm() {
    if (this.type === 'userAvatar') {
      this.userService.uploadAvatar(this.file);
    }
    if (this.type === 'actorAvatar') {
      this.actorService.uploadAvatar(this.file, this.fileId);
    }
    this.modalController.dismiss(this.file);
  }
}
