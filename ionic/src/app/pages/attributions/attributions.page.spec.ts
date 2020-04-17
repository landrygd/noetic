import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttributionsPage } from './attributions.page';

describe('AttributionsPage', () => {
  let component: AttributionsPage;
  let fixture: ComponentFixture<AttributionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AttributionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
