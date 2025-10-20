import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleItemComponent } from './people-item.component';

describe('PeopleItemComponent', () => {
  let component: PeopleItemComponent;
  let fixture: ComponentFixture<PeopleItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
