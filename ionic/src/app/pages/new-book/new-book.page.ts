import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TraductionService } from 'src/app/services/traductionService.service';
import { BookService } from 'src/app/services/book.service';
import { UserService } from 'src/app/services/user.service';
import { PopupService } from 'src/app/services/popup.service';

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
  bookId: string;

  constructor(
    public bookService: BookService,
    public userService: UserService,
    public modalCtrl: ModalController,
    public nacCtrl: NavController,
    private formBuilder: FormBuilder,
    private translator: TraductionService,
    private popupService: PopupService
    ) {
    this.bookId = this.bookService.generateBookId();
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
    const authors = [this.userService.userId];

    // Traitement des infos
    if (title.length < 3) {
      this.popupService.alert('Le titre doit faire au moins plus de 3 caractères');
      return;
    } else if (title.length > 40) {
      this.popupService.alert('Le titre doit faire moins 40 caractères');
      return;
    } else if (form.desc.length < 3) {
      this.popupService.alert('La description doit faire au moins plus de 3 caractères');
      return;
    } else if (form.desc.length > 250) {
      this.popupService.alert('La description doit faire moins de 250 caractères');
      return;
    } else if (this.tags.length > 5) {
      this.popupService.alert('Il ne doit pas y avoir plus de 5 tags');
      return;
    } else if (form.verso.length > 2000) {
      this.popupService.alert('Le verso doit faire moins de 2000 caractères');
      return;
    }

    const book = {
      id: this.bookId,
      title,
      titleLower: title.toLowerCase(),
      desc: form.desc,
      stars: 0,
      starsAvg: 0,
      votes: 0,
      views: 0,
      tags: this.tags,
      cover: this.cover,
      cat: form.cat,
      verso: form.verso,
      lang: this.translator.getCurLanguage(),
      authors,
      date: Date.now()
    };
    this.bookService.newBook(book, this.cover, this.bookId);
  }

  async changeCover() {
    const modal = await this.modalCtrl.create({
      component: UploadComponent,
      componentProps: {
        type: 'cover',
        fileId: this.bookId
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
      if (this.tags.length >= 5) {
        this.popupService.alert('Il ne doit pas y avoir plus de 5 tags');
        return;
      } else {
        this.addTag();
      }
    }
  }

  addTag() {
    const tag: string = this.bookForm.value.tag;
    if (tag !== '') {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag.toLowerCase());
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

