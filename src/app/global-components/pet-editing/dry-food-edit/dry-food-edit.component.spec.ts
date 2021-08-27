import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DryFoodEditComponent } from './dry-food-edit.component';

describe('DryFoodEditComponent', () => {
  let component: DryFoodEditComponent;
  let fixture: ComponentFixture<DryFoodEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DryFoodEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DryFoodEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
