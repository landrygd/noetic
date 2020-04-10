import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardBookComponent } from './card-book.component';

describe('CardBookComponent', () => {
  let component: CardBookComponent;
  let fixture: ComponentFixture<CardBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardBookComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
