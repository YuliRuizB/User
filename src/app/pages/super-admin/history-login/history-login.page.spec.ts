import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistoryLoginPage } from './history-login.page';

describe('HistoryLoginPage', () => {
  let component: HistoryLoginPage;
  let fixture: ComponentFixture<HistoryLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
