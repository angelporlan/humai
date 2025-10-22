import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareboxComponent } from './sharebox.component';

describe('ShareboxComponent', () => {
  let component: ShareboxComponent;
  let fixture: ComponentFixture<ShareboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
