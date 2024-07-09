import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarConnectedComponent } from './navbar-connecte.component';


describe('NavbarComponent', () => {
  let component: NavbarConnectedComponent;
  let fixture: ComponentFixture<NavbarConnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarConnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
