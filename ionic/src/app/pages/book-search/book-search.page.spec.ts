import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookSearchPage } from './book-search.page';

describe('BookSearchPage', () => {
  let component: BookSearchPage;
  let fixture: ComponentFixture<BookSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
