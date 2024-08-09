import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  loadArticles,
  loadArticlesFailure,
  loadArticlesSuccess,
} from '../store/actions/article.action';

export interface Article {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  author: string;
  publishDate: string;
  featured: boolean;
  type: string;
  tags: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private apiUrl = 'http://localhost:3000/articles';
  private storageKey = 'articles';
  private draftsKey = 'drafts';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  saveArticle(article: any): void {
    let articles = this.getStoredArticles();
    articles.push(article);
    localStorage.setItem(this.storageKey, JSON.stringify(articles));
  }

  getStoredArticles(): Article[] {
    const articles = localStorage.getItem(this.storageKey);
    return articles ? JSON.parse(articles) : [];
  }

  saveDraft(article: any): void {
    let drafts = this.getStoredDrafts();
    drafts.push(article);
    localStorage.setItem(this.draftsKey, JSON.stringify(drafts));
  }

  getStoredDrafts(): Article[] {
    const drafts = localStorage.getItem(this.draftsKey);
    return drafts ? JSON.parse(drafts) : [];
  }

  deleteDraft(index: number): void {
    let drafts = this.getStoredDrafts();
    drafts.splice(index, 1);
    localStorage.setItem(this.draftsKey, JSON.stringify(drafts));
  }

  getFeaturedArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}?featured=true`);
  }
}
