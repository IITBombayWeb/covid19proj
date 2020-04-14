import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcuComponent } from './icu.component';

describe('IcuComponent', () => {
  let component: IcuComponent;
  let fixture: ComponentFixture<IcuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
