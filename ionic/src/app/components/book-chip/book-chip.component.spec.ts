import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookChipComponent } from './book-chip.component';

describe('BookChipComponent', () => {
  let component: BookChipComponent;
  let fixture: ComponentFixture<BookChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookChipComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
