import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TraductionService } from 'src/app/services/traductionService.service';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.page.html',
  styleUrls: ['./new-book.page.scss'],
})

export class NewBookPage implements OnInit {
  coverSize = 'cover';
  cover = '../../../assets/cover/cover1.png';
  tags = [];

  bookForm: FormGroup;

  constructor(
    public firebase: FirebaseService,
    public modalCtrl: ModalController,
    public nacCtrl: NavController,
    private formBuilder: FormBuilder,
    private translator: TraductionService
    ) {
    const max = 3;
    const min = 1;
    const coverNumber = Math.floor(Math.random() * (max - min + 1) + min);
    this.cover = '../../../assets/cover/cover' + coverNumber + '.png';
    this.bookForm = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      cat: ['undefined', Validators.required],
      verso: [''],
      tag: ['']
    });
   }

  ngOnInit() {}

  confirm() {
    const form = this.bookForm.value;
    const title: string = form.name;
    const book = {
      title,
      titleLower: title.toLowerCase(),
      desc: form.desc,
      first: 'main',
      star: 0,
      vote: 0,
      view: 0,
      tags: this.tags,
      cover: this.cover,
      cat: form.cat,
      authors: [this.firebase.userId],
      verso: form.verso,
      lang: this.translator.getCurLanguage(),
      ref: [],
    };
    this.firebase.addBook(book, this.cover);
  }

  async changeCover() {
    const modal = await this.modalCtrl.create({
      component: UploadComponent,
      componentProps: {
        type: 'cover'
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data) {
          this.cover = data.data;
          this.coverSize = '';
          setTimeout(() => this.coverSize = 'cover', 50);
        }
    });
    return await modal.present();
  }

  enter(keyCode) {
    if (keyCode === 13) {
      this.addTag();
    }
  }

  addTag() {
    if (this.bookForm.value.tag !== '') {
      if (!this.tags.includes(this.bookForm.value.tag)) {
        this.tags.push(this.bookForm.value.tag);
        this.bookForm.value.tag = '';
        this.bookForm.patchValue({tag: ''});
      }
    }
  }

  removeTag(index) {
    this.tags.splice(index, 1);
  }

  back() {
    this.nacCtrl.back();
  }
}

