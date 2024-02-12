import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GpsRequestInfoPage } from './gps-request-info.page';

describe('GpsRequestInfoPage', () => {
  let component: GpsRequestInfoPage;
  let fixture: ComponentFixture<GpsRequestInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpsRequestInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GpsRequestInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
