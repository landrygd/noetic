import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewBookPage } from './new-book.page';

describe('NewBookPage', () => {
  let component: NewBookPage;
  let fixture: ComponentFixture<NewBookPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBookPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewBookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
