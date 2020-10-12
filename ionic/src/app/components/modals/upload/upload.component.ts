import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/services/user.service';
import { BookService } from 'src/app/services/book.service';
import { PopupService } from 'src/app/services/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {

  @ViewChild('myCanvas', { read: ElementRef, static: true}) canvas: ElementRef<HTMLCanvasElement>;

  COMMON: any = {};
  UPLOAD: any = {};

  commonSub: Subscription;
  uploadSub: Subscription;

  @Input() type = '';
  @Input() fileId = '';
  @Input() gallery = false;

  path = 'unknowed';
  userId: string;
  file: File;
  ratio = 1;
  width = 200;
  free = false;
  lines: number;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  imported = false;

  isImage = false;
  output: string;
  accept = '*';

  constructor(
    private modalController: ModalController,
    public userService: UserService,
    public bookService: BookService,
    private popupService: PopupService,
    private translator: TranslateService,
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
    if (this.type === 'avatar') {
      this.ratio = 1;
      this.width = 200;
    }
    if (this.type === 'free') {
      this.free = true;
      this.ratio = 1;
      this.width = 500;
    }
    // if (this.type === 'script') {
    //   this.accept = 'noe';
    // }
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

  async fileChangeEvent(event: any) {
    this.file =  event.addedFiles[0];
    if (this.file.type.includes('image')) {
      this.isImage = true;
    }
    if (this.type === 'script') {
      this.output = await this.file.text();
      this.lines = this.output.split('\n').length;
    }
    this.imported = true;
  }

  async imageCropped(event: ImageCroppedEvent) {
    const mime = this.getBase64MimeType(event.base64);
    this.output = event.base64;
    if (mime !== 'image/jpeg') {
      this.output = await this.pngToJpeg(event.base64);
    }
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

  async confirm() {
    if (this.type === 'userAvatar') {
      this.userService.uploadAvatar(this.output);
    }
    this.modalController.dismiss(this.output);
  }

  pngToJpeg(base64: string): Promise<string> {
    return new Promise((resolve) => {
      const canvas = this.canvas.nativeElement;
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const jpegBase64 = canvas.toDataURL('image/jpeg', 0.5);
        resolve(jpegBase64);
      };
      img.onerror = () => resolve(base64);
    });
  }

  getBase64MimeType(encoded): string {
    let result = null;
    if (typeof encoded !== 'string') {
      return result;
    }
    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }
    return result;
  }

  async openGallery() {
    const modal = await this.modalController.create({
    component: GalleryComponent,
    componentProps: { }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.data) {
      setTimeout(() => this.dismiss({url: data.data.url}), 100);
    }
  }

  dismiss(data?) {
    this.modalController.dismiss(data);
  }
}
