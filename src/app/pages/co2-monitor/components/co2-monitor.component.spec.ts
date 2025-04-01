import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Co2MonitorComponent } from './co2-monitor.component';

describe('Co2MonitorComponent', () => {
  let component: Co2MonitorComponent;
  let fixture: ComponentFixture<Co2MonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Co2MonitorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Co2MonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
