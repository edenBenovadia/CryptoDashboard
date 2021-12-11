import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTitleComponent } from './balance-title.component';

describe('BalanceTitleComponent', () => {
  let component: BalanceTitleComponent;
  let fixture: ComponentFixture<BalanceTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
