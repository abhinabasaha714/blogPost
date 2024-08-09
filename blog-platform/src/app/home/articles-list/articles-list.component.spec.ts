import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesListComponent } from './articles-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { of } from 'rxjs';
import { ArticlesService } from '../../services/articles.service';
import { SharedService } from '../../services/shared.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ArticlesListComponent', () => {
  let component: ArticlesListComponent;
  let fixture: ComponentFixture<ArticlesListComponent>;
  let mockArticlesService: jasmine.SpyObj<ArticlesService>;
  let mockSharedService: jasmine.SpyObj<SharedService>;

  const articlesMock = [
    { id: 1, title: 'Article 1', thumbnail: '', description: 'Description 1', author: 'Author 1', publishDate: '2024-01-01', featured: false, type: 'news', tags: [] },
    { id: 2, title: 'Article 2', thumbnail: '', description: 'Description 2', author: 'Author 2', publishDate: '2024-01-02', featured: false, type: 'tech', tags: [] }
  ];

  beforeEach(async () => {
    const articlesServiceSpy = jasmine.createSpyObj('ArticlesService', ['getArticles', 'getStoredArticles']);
    const sharedServiceSpy = jasmine.createSpyObj('SharedService', ['modalTitle', 'modalMessage']);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        BrowserAnimationsModule,
        ArticlesListComponent,
        MatPaginator
      ],
      declarations: [ ],
      providers: [
        { provide: ArticlesService, useValue: articlesServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy }
      ]
    }).compileComponents();

    mockArticlesService = TestBed.inject(ArticlesService) as jasmine.SpyObj<ArticlesService>;
    mockSharedService = TestBed.inject(SharedService) as jasmine.SpyObj<SharedService>;

    fixture = TestBed.createComponent(ArticlesListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and process articles on initialization', () => {
    
    mockArticlesService.getArticles.and.returnValue(of(articlesMock));
    mockArticlesService.getStoredArticles.and.returnValue([]);    
    fixture.detectChanges();   
    expect(component.articles).toEqual(articlesMock);
    expect(component.filteredResultsLength).toBe(articlesMock.length);
    expect(component.paginatedArticles).toEqual(articlesMock.slice(0, component.pageSize));
  });

  it('should filter articles by query', () => {
    
    mockArticlesService.getArticles.and.returnValue(of(articlesMock));
    mockArticlesService.getStoredArticles.and.returnValue([]);    
    fixture.detectChanges();
    component.control.setValue('Article 1');   
    component.filteredResults.subscribe(filteredArticles => {
      expect(filteredArticles.length).toBe(2);
      expect(filteredArticles[0].title).toBe('Article 1');
    });
  });

  it('should update pagination when page changes', () => {
    
    mockArticlesService.getArticles.and.returnValue(of(articlesMock));
    mockArticlesService.getStoredArticles.and.returnValue([]);    
    fixture.detectChanges();
    component.onPageChange({ pageIndex: 1, pageSize: 1, length: articlesMock.length } as PageEvent);   
    expect(component.paginatedArticles).toEqual(articlesMock.slice(1, 2));
  });

  it('should apply type filter correctly', () => {
    
    mockArticlesService.getArticles.and.returnValue(of(articlesMock));
    mockArticlesService.getStoredArticles.and.returnValue([]);    
    fixture.detectChanges();
    component.onButtonClick('tech');   
    component.filteredResults.subscribe(filteredArticles => {
      expect(filteredArticles.length).toBe(1);
      expect(filteredArticles[0].type).toBe('tech');
    });
  });

  it('should remove HTML tags from description', () => {
    const htmlString = '<p>This is <b>bold</b> and <i>italic</i></p>';
    const result = component.removeHTMLTags(htmlString);
    expect(result).toBe('This is bold and italic');
  });

  it('should handle empty articles list', () => {
    mockArticlesService.getArticles.and.returnValue(of([]));
    mockArticlesService.getStoredArticles.and.returnValue([]);
    fixture.detectChanges();
    expect(component.articles).toEqual([]);
    expect(component.filteredResultsLength).toBe(0);
    expect(component.paginatedArticles).toEqual([]);
  });
});