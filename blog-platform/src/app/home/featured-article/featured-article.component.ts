import { Component } from '@angular/core';
import { ArticlesService } from '../../services/articles.service';
import { CommonModule } from '@angular/common';
import { ArticlesComponent } from '../articles-list/articles/articles.component';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-article',
  standalone: true,
  imports: [CommonModule, ArticlesComponent, MatCardModule],
  templateUrl: './featured-article.component.html',
  styleUrl: './featured-article.component.scss',
})
export class FeaturedArticleComponent {
  featuredArticles: any[] = [];

  constructor(
    private articleService: ArticlesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFeaturedArticles();
  }

  fetchFeaturedArticles(): void {
    this.articleService.getFeaturedArticles().subscribe((data: any[]) => {
      this.featuredArticles = data;
    });
  }

  readMore(index: number): void {
    this.router.navigate(['/article', this.featuredArticles[index].id]);
  }
}
