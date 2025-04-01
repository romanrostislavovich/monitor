import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastFmComponent } from './last-fm.component';

describe('LastFmComponent', () => {
  let component: LastFmComponent;
  let fixture: ComponentFixture<LastFmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastFmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LastFmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
