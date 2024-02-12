import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckRequestPreRegisterPage } from './check-request-pre-register.page';

describe('CheckRequestPreRegisterPage', () => {
  let component: CheckRequestPreRegisterPage;
  let fixture: ComponentFixture<CheckRequestPreRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckRequestPreRegisterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckRequestPreRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
