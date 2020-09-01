import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IdFinderComponent } from './id-finder.component';

describe('IdFinderComponent', () => {
  let component: IdFinderComponent;
  let fixture: ComponentFixture<IdFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdFinderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IdFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
