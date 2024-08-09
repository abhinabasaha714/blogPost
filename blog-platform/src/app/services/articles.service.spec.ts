import { TestBed } from '@angular/core/testing';

import { Article, ArticlesService } from './articles.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [ArticlesService, { provide: HttpClient, useValue: spy }],
    });

    service = TestBed.inject(ArticlesService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get articles from the API', (done: DoneFn) => {
    const expectedArticles: Article[] = [
      {
        id: 1,
        title: 'Test Article',
        thumbnail: '',
        description: '',
        author: '',
        publishDate: '',
        featured: false,
        type: '',
        tags: [],
      },
    ];

    httpClientSpy.get.and.returnValue(of(expectedArticles));
    service.getArticles().subscribe((articles) => {
      expect(articles).toEqual(expectedArticles);
      done();
    });
  });

  it('should get featured articles from the API', (done: DoneFn) => {
    const expectedArticles: Article[] = [
      {
        id: 1,
        title: 'Featured Article',
        thumbnail: '',
        description: '',
        author: '',
        publishDate: '',
        featured: true,
        type: '',
        tags: [],
      },
    ];
    httpClientSpy.get.and.returnValue(of(expectedArticles));
    service.getFeaturedArticles().subscribe((articles) => {
      expect(articles).toEqual(expectedArticles);
      done();
    });
  });

  it('should save an article to local storage', () => {
    const article: Article = {
      id: 1,
      title: 'New Article',
      thumbnail: '',
      description: '',
      author: '',
      publishDate: '',
      featured: false,
      type: '',
      tags: [],
    };
    spyOn(localStorage, 'setItem').and.callThrough();
    service.saveArticle(article);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'articles',
      JSON.stringify([article])
    );
  });

  it('should retrieve stored articles from local storage', () => {
    const storedArticles: Article[] = [
      {
        id: 1,
        title: 'Stored Article',
        thumbnail: '',
        description: '',
        author: '',
        publishDate: '',
        featured: false,
        type: '',
        tags: [],
      },
    ];
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(storedArticles)
    );
    const articles = service.getStoredArticles();
    expect(articles).toEqual(storedArticles);
  });

  it('should save a draft to local storage', () => {
    const draft: Article = {
      id: 1,
      title: 'Draft Article',
      thumbnail: '',
      description: '',
      author: '',
      publishDate: '',
      featured: false,
      type: '',
      tags: [],
    };
    spyOn(localStorage, 'setItem').and.callThrough();
    service.saveDraft(draft);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'drafts',
      JSON.stringify([draft])
    );
  });

  it('should retrieve stored drafts from local storage', () => {
    const storedDrafts: Article[] = [
      {
        id: 1,
        title: 'Stored Draft',
        thumbnail: '',
        description: '',
        author: '',
        publishDate: '',
        featured: false,
        type: '',
        tags: [],
      },
    ];
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(storedDrafts)
    );
    const drafts = service.getStoredDrafts();
    expect(drafts).toEqual(storedDrafts);
  });

  it('should delete a draft from local storage', () => {
    const drafts: Article[] = [
      {
        id: 1,
        title: 'Draft to Keep',
        thumbnail: '',
        description: '',
        author: '',
        publishDate: '',
        featured: false,
        type: '',
        tags: [],
      },
      {
        id: 2,
        title: 'Draft to Delete',
        thumbnail: '',
        description: '',
        author: '',
        publishDate: '',
        featured: false,
        type: '',
        tags: [],
      },
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(drafts));
    spyOn(localStorage, 'setItem').and.callThrough();
    service.deleteDraft(1);
    const remainingDrafts = [
      {
        id: 1,
        title: 'Draft to Keep',
        thumbnail: '',
        description: '',
        author: '',
        publishDate: '',
        featured: false,
        type: '',
        tags: [],
      },
    ];
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'drafts',
      JSON.stringify(remainingDrafts)
    );
  });
});
