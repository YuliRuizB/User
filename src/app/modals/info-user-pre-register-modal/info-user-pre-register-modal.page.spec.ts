import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoUserPreRegisterModalPage } from './info-user-pre-register-modal.page';

describe('InfoUserPreRegisterModalPage', () => {
  let component: InfoUserPreRegisterModalPage;
  let fixture: ComponentFixture<InfoUserPreRegisterModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUserPreRegisterModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoUserPreRegisterModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
