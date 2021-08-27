import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WetFoodEditComponent } from './wet-food-edit.component';

describe('WetFoodEditComponent', () => {
  let component: WetFoodEditComponent;
  let fixture: ComponentFixture<WetFoodEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WetFoodEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WetFoodEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
