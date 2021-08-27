import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgeComponent } from './age.component';

describe('AgeComponent', () => {
  let component: AgeComponent;
  let fixture: ComponentFixture<AgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
