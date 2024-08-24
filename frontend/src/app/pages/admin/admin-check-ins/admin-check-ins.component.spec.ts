import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCheckInsComponent } from './admin-check-ins.component';

describe('AdminCheckInsComponent', () => {
  let component: AdminCheckInsComponent;
  let fixture: ComponentFixture<AdminCheckInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCheckInsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCheckInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
