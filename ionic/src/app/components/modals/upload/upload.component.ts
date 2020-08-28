import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';
import { ActorService } from 'src/app/services/book/actor.service';
import { PopupService } from 'src/app/services/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PlaceService } from 'src/app/services/book/place.service';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {

  COMMON: any = {};
  UPLOAD: any = {};

  commonSub: Subscription;
  uploadSub: Subscription;

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
    private popupService: PopupService,
    private translator: TranslateService,
    private placeService: PlaceService
  ) { }

  async ngOnInit() {
    this.getTraduction();
    if (this.type === 'cover') {
      this.ratio = 9 / 16;
      this.width = 180;
    }
    if (this.type === 'banner') {
      this.ratio = 16 / 9;
      this.width = 1280;
    }
  }

  getTraduction() {
    this.uploadSub = this.translator.get('MODALS.UPLOAD').subscribe((val) => {
      this.UPLOAD = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.uploadSub.unsubscribe();
    this.commonSub.unsubscribe();
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
    this.popupService.alert(this.UPLOAD.error);
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
    switch (this.type) {
      case 'userAvatar':
        this.userService.uploadAvatar(this.file);
        break;
      case 'actorAvatar':
        this.bookService.uploadAvatar(this.file, this.fileId, 'actors');
        break;
      case 'itemAvatar':
        this.bookService.uploadAvatar(this.file, this.fileId, 'items');
        break;
      case 'placeAvatar':
        this.bookService.uploadAvatar(this.file, this.fileId, 'places');
        break;
      case 'roleAvatar':
        this.bookService.uploadAvatar(this.file, this.fileId, 'roles');
        break;
    }
    this.modalController.dismiss(this.file);
  }
}
