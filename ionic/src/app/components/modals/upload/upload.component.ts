import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.scss'],
})
export class UploadComponent implements OnInit {

  @Input() type: string = '';

  path: string = "unknowed";
  userId: string;
  file: any;
  ratio:number = 1;
  width:number = 200;

  constructor(private modalController: ModalController, public firebase: FirebaseService) {
  }

  ngOnInit() {
    if(this.type == 'cover') {
      this.ratio = 9/16;
      this.width = 180;
    }
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';
  imported: boolean = false;
  
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
    if(this.type!=="cover") {
      this.firebase.uploadFile(this.type, this.file);
    }
    this.modalController.dismiss(this.file);
  }
}
