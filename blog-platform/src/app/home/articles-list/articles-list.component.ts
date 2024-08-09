import { Component } from '@angular/core';
import { Article, ArticlesService } from '../../services/articles.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { ArticlesComponent } from './articles/articles.component';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  startWith,
} from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    ArticlesComponent,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.scss',
})
export class ArticlesListComponent {
  articles: Article[] = [];
  paginatedArticles: Article[] = [];
  pageSize: number = 6;
  currentPage: number = 0;
  control = new FormControl('');
  filteredResults!: Observable<Article[]>;
  filteredResultsLength: number = 0;
  selectedType: string = 'all';

  private selectedTypeSubject = new BehaviorSubject<string>('all');
  private searchQuerySubject = new BehaviorSubject<string>('');

  constructor(
    private articleService: ArticlesService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.fetchArticles();

    this.filteredResults = combineLatest([
      this.control.valueChanges.pipe(startWith('')),
      this.selectedTypeSubject,
    ]).pipe(map(([query, type]) => this._filter(query, type)));

    this.filteredResults.subscribe((results) => {
      this.filteredResultsLength = results.length;
      this.currentPage = 0;
      this.updatePaginatedArticles(results);
    });
  }

  fetchArticles(): void {
    this.articleService.getArticles().subscribe((data: any) => {
      const newlyAddedData = this.articleService.getStoredArticles();
      if (newlyAddedData.length > 0) {
        const newData = newlyAddedData.map((newValue, index) => {
          let newAddition = {
            id: data.length + index + 1,
            title: newValue?.title,
            thumbnail: newValue?.thumbnail,
            description: this.removeHTMLTags(newValue?.description),
            author: newValue?.author,
            publishDate: newValue?.publishDate,
            featured: false,
            type: newValue?.type,
            tags: ['lifestyle'],
          };

          const imgRegex = /<img[^>]+src="([^">]+)"/g;
          const matches = imgRegex.exec(newValue?.description);
          if (matches && matches[1]) {
            newAddition.thumbnail = matches[1];
            newAddition.description = newValue?.description.replace(
              matches[0],
              ''
            );
          }

          return newAddition;
        });

        this.articles = [...data, ...newData];
      } else {
        this.articles = data;
      }

      this.filteredResultsLength = this.articles.length;
      this.updatePaginatedArticles(this.articles);
    });
  }

  removeHTMLTags(str: string) {
    return str?.replace(/<\/?[^>]+(>|$)/g, '');
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.filteredResults.subscribe((filteredArticles) => {
      this.updatePaginatedArticles(filteredArticles);
    });
  }

  private updatePaginatedArticles(filteredArticles: Article[]): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedArticles = filteredArticles.slice(start, end);
  }

  private _filter(query: any, type: string): Article[] {
    const filterValue = this._normalizeValue(query);
    let filteredArticles = this.articles;

    if (type !== 'all') {
      filteredArticles = filteredArticles.filter(
        (article) => article.type === type
      );
    }

    return filteredArticles.filter(
      (article) =>
        this._normalizeValue(article.title)?.includes(filterValue) ||
        this._normalizeValue(article.author)?.includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value?.toLowerCase().replace(/\s/g, '');
  }

  onButtonClick(type: string): void {
    this.selectedType = type;
    this.selectedTypeSubject.next(type);
    this.currentPage = 0;
    this.filteredResults.subscribe((filteredArticles) => {
      this.updatePaginatedArticles(filteredArticles);
    });
  }
}
