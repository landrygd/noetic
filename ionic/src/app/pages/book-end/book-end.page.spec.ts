import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookEndPage } from './book-end.page';

describe('BookEndPage', () => {
  let component: BookEndPage;
  let fixture: ComponentFixture<BookEndPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookEndPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookEndPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
