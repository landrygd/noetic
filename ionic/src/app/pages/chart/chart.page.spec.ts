import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChartPage } from './chart.page';

describe('ChartPage', () => {
  let component: ChartPage;
  let fixture: ComponentFixture<ChartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
