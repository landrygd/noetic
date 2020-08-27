import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActorsPage } from './actors.page';

describe('ActorsPage', () => {
  let component: ActorsPage;
  let fixture: ComponentFixture<ActorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActorsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
