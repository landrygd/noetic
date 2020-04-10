import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoryPage } from './story.page';

describe('StoryPage', () => {
  let component: StoryPage;
  let fixture: ComponentFixture<StoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
