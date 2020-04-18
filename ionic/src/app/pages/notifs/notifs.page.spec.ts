import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotifsPage } from './notifs.page';

describe('NotifsPage', () => {
  let component: NotifsPage;
  let fixture: ComponentFixture<NotifsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotifsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
