import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMessage } from './search-message';

describe('SearchMessage', () => {
  let component: SearchMessage;
  let fixture: ComponentFixture<SearchMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
