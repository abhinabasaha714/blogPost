import { Component } from '@angular/core';
import { AuthorService } from '../services/author.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthorCardComponent } from './author-card/author-card.component';
import { Article, ArticlesService } from '../services/articles.service';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { ArticlesComponent } from '../home/articles-list/articles/articles.component';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { MagnifyDirective } from '../directive/magnify.directive';

@Component({
  selector: 'app-author-articles',
  standalone: true,
  imports: [
    CommonModule,
    AuthorCardComponent,
    MatCardModule,
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
    MagnifyDirective,
  ],
  templateUrl: './author-articles.component.html',
  styleUrl: './author-articles.component.scss',
})
export class AuthorArticlesComponent {
  authors: any[] = [];
  readersArticles: any = [];
  filteredResults$!: Observable<any[]>;
  control = new FormControl('');
  visibleArticles: any[] = [];
  currentIndex: number = 0;
  itemsPerPage: number = 3;

  constructor(
    private authorService: AuthorService,
    private articleService: ArticlesService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.risingAuthors();
    this.fetchreadersChoiceArticles();
    this.filteredResults$ = combineLatest([
      this.control.valueChanges.pipe(startWith('')),
      this.articleService.getArticles(),
    ]).pipe(map(([search, articles]) => this._filter(articles, search)));
  }
  public fetchreadersChoiceArticles(): void {
    this.articleService.getArticles().subscribe((data: any[]) => {
      this.readersArticles = data;
      this.updateVisibleArticles();
    });
  }
  public risingAuthors(): void {
    this.authorService.getAuthors().subscribe((data) => {
      this.authors = data;
    });
  }

  private _filter(articles: any[], search: any): any[] {
    if (!search.trim()) {
      return [];
    }
    const filterValue = search.toLowerCase();
    return articles.filter(
      (article) =>
        article.author.toLowerCase().includes(filterValue) ||
        article.title.toLowerCase().includes(filterValue)
    );
  }

  private updateVisibleArticles(): void {
    this.visibleArticles = this.readersArticles.slice(
      this.currentIndex,
      this.currentIndex + this.itemsPerPage
    );
  }

  public nextSlide(): void {
    if (this.currentIndex + this.itemsPerPage < this.readersArticles.length) {
      this.currentIndex += this.itemsPerPage;
      this.updateVisibleArticles();
    }
  }

  public prevSlide(): void {
    if (this.currentIndex - this.itemsPerPage >= 0) {
      this.currentIndex -= this.itemsPerPage;
      this.updateVisibleArticles();
    }
  }

  public readMore(index: number) {
    this.sharedService.fromReadersChoice.next(true);
    this.router.navigate(['/article', this.readersArticles[index].id]);
  }

  public showMore(data: any) {
    this.router.navigate(['/article', data.id]);
  }
}
