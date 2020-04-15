import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScuComponent } from './scu.component';

describe('ScuComponent', () => {
  let component: ScuComponent;
  let fixture: ComponentFixture<ScuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
