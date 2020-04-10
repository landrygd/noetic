import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabsBookPage } from './tabs-book.page';

describe('TabsBookPage', () => {
  let component: TabsBookPage;
  let fixture: ComponentFixture<TabsBookPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsBookPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsBookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
