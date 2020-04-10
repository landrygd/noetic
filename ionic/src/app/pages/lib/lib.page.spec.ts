import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LibPage } from './lib.page';

describe('LibPage', () => {
  let component: LibPage;
  let fixture: ComponentFixture<LibPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LibPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
