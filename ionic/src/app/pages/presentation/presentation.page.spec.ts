import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PresentationPage } from './presentation.page';

describe('PresentationPage', () => {
  let component: PresentationPage;
  let fixture: ComponentFixture<PresentationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PresentationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
