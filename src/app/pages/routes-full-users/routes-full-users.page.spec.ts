import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoutesFullUsersPage } from './routes-full-users.page';

describe('RoutesFullUsersPage', () => {
  let component: RoutesFullUsersPage;
  let fixture: ComponentFixture<RoutesFullUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesFullUsersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesFullUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
