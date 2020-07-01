import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogEditComponent } from './log-edit.component';

describe('LogEditComponent', () => {
  let component: LogEditComponent;
  let fixture: ComponentFixture<LogEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
