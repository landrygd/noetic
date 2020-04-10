import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingsBookPage } from './settings-book.page';

describe('SettingsBookPage', () => {
  let component: SettingsBookPage;
  let fixture: ComponentFixture<SettingsBookPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsBookPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsBookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
