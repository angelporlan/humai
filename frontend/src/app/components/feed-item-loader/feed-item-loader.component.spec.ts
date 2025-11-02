import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedItemLoaderComponent } from './feed-item-loader.component';

describe('FeedItemLoaderComponent', () => {
  let component: FeedItemLoaderComponent;
  let fixture: ComponentFixture<FeedItemLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedItemLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedItemLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
