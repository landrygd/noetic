import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserChipComponent } from './user-chip.component';

describe('UserChipComponent', () => {
  let component: UserChipComponent;
  let fixture: ComponentFixture<UserChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserChipComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
