import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MealsPerDayComponent } from './meals-per-day.component';

describe('MealsPerDayComponent', () => {
  let component: MealsPerDayComponent;
  let fixture: ComponentFixture<MealsPerDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealsPerDayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MealsPerDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
