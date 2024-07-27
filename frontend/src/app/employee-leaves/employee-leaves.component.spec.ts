import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeavesComponent } from './employee-leaves.component';

describe('EmployeeLeavesComponent', () => {
  let component: EmployeeLeavesComponent;
  let fixture: ComponentFixture<EmployeeLeavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeLeavesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
