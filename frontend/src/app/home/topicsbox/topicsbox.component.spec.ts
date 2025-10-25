import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsboxComponent } from './topicsbox.component';

describe('TopicsboxComponent', () => {
  let component: TopicsboxComponent;
  let fixture: ComponentFixture<TopicsboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
