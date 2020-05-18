import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfflinePage } from './offline.page';

describe('OfflinePage', () => {
  let component: OfflinePage;
  let fixture: ComponentFixture<OfflinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfflinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
