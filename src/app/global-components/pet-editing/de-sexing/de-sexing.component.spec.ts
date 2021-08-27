import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeSexingComponent } from './de-sexing.component';

describe('DeSexingComponent', () => {
  let component: DeSexingComponent;
  let fixture: ComponentFixture<DeSexingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeSexingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeSexingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
