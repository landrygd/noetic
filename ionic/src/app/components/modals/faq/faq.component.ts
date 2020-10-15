import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {

  @ViewChild('searchbar', {static: true, read: IonSearchbar}) searchBar: IonSearchbar; 

  FAQ: {question: string, answer: string, example: string}[] = [];
  faqSub: Subscription;

  results: {question: string, answer: string, example: string}[] = []

  constructor(
    private translator: TranslateService,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.getTraduction();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchBar.setFocus();
    });
  }

  getTraduction() {
    this.faqSub = this.translator.get('FAQ').subscribe((val) => {
      if (Array.isArray(val)) {
        this.FAQ = val;
      } else {
        this.FAQ = [];
        Object.values(val).forEach((element: any) => {
          element.messages = Object.values(element.messages);
          this.FAQ.push(element);

        });
      }
      const res = [];
      this.FAQ.forEach(question => {
        if (question.example) {
          question.example = question.example.replace(/VAR_/g, '$');
          question.example = question.example.replace(/COM_/g, '/');
          question.example = question.example.replace(/ICON_([a-z-_]*)/g, ':i-$1:');
        }
        res.push(question);
      })
      this.FAQ = res;
      this.results = this.FAQ;
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  search(filter: string) {
    const result = [];
    const tags = filter.split(' ');
    tags.forEach(tag => {
      const res = this.FAQ.filter((val) => val.question.toLocaleLowerCase().includes(tag.toLocaleLowerCase()));
      res.forEach(val => {
        if (!result.includes(val)) {
          result.push(val);
        }
      })
    });
    if (result !== this.results) {
      this.results = result;
    }
  }

}
