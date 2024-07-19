import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportIssueModalPage } from './report-issue-modal.page';

describe('ReportIssueModalPage', () => {
  let component: ReportIssueModalPage;
  let fixture: ComponentFixture<ReportIssueModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportIssueModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportIssueModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
