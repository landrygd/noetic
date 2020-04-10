import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewActorComponent } from './new-actor.component';

describe('NewActorComponent', () => {
  let component: NewActorComponent;
  let fixture: ComponentFixture<NewActorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewActorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewActorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
