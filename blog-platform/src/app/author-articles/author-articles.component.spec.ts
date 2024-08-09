import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorArticlesComponent } from './author-articles.component';

describe('AuthorArticlesComponent', () => {
  let component: AuthorArticlesComponent;
  let fixture: ComponentFixture<AuthorArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorArticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
