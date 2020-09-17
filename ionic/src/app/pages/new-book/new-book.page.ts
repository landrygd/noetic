import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UploadComponent } from 'src/app/components/modals/upload/upload.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TraductionService } from 'src/app/services/traductionService.service';
import { BookService } from 'src/app/services/book.service';
import { UserService } from 'src/app/services/user.service';
import { PopupService } from 'src/app/services/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/classes/book';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.page.html',
  styleUrls: ['./new-book.page.scss'],
})

export class NewBookPage implements OnInit, OnDestroy {
  coverSize = 'cover';
  cover = '../../../assets/cover/cover1.png';
  tags = [];

  bookForm: FormGroup;
  bookId: string;

  newBookSub: Subscription;
  commonSub: Subscription;

  NEWBOOK: any;
  COMMON: any;

  constructor(
    public bookService: BookService,
    public userService: UserService,
    public modalCtrl: ModalController,
    public nacCtrl: NavController,
    private formBuilder: FormBuilder,
    private translator: TranslateService,
    private traductionService: TraductionService,
    private popupService: PopupService,
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

  ngOnInit() {
    this.getTraduction();
  }

  getTraduction() {
    this.newBookSub = this.translator.get('NEWBOOK').subscribe((val) => {
      this.NEWBOOK = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.newBookSub.unsubscribe();
    this.commonSub.unsubscribe();
  }


  confirm() {
    const form = this.bookForm.value;
    const title: string = form.name;
    const author = this.userService.userId;

    // Traitement des infos
    if (title.length < 3) {
      this.popupService.alert(this.NEWBOOK.titleMinError);
      return;
    } else if (title.length > 40) {
      this.popupService.alert(this.NEWBOOK.titleMaxError);
      return;
    } else if (form.desc.length < 3) {
      this.popupService.alert(this.NEWBOOK.descMinError);
      return;
    } else if (form.desc.length > 250) {
      this.popupService.alert(this.NEWBOOK.descMaxError);
      return;
    } else if (this.tags.length > 5) {
      this.popupService.alert(this.NEWBOOK.tagMaxError);
      return;
    } else if (form.verso.length > 2000) {
      this.popupService.alert(this.NEWBOOK.versoMaxError);
      return;
    }

    const bookOpts = {
      id: this.bookId,
      name,
      nameLower: title.toLowerCase(),
      description: form.desc,
      tags: this.tags,
      cover: this.cover,
      category: form.cat,
      verso: form.verso,
      lang: this.traductionService.getCurLanguage(),
      author,
    };

    // this.bookService.newBook(new Book(bookOpts));
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
        this.popupService.alert(this.NEWBOOK.tagMaxError);
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

