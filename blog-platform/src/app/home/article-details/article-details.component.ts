import { Component, OnDestroy, OnInit } from '@angular/core';
import { Article, ArticlesService } from '../../services/articles.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedService } from '../../services/shared.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MagnifyDirective } from '../../directive/magnify.directive';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    CommentSectionComponent,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MagnifyDirective,
  ],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss',
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  article!: any;
  newComment: string = '';
  comments: string[] = [];
  showComments: boolean = false;
  articleId: any;
  relatedArticles!: any[];
  fromReadersChoice: any;
  sub!: Subscription;
  storedArticles: any;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticlesService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
    this.sub = this.sharedService.fromReadersChoice.subscribe(
      (res) => (this.fromReadersChoice = res)
    );

    this.loadArticles();
    this.fetchrelatedArticles();
  }

  public async loadArticles() {
    await this.loadDataFromJson();
    await this.loadNewData();
    this.article = this.fromReadersChoice ? this.storedArticles : this.article;
  }

  public async loadDataFromJson() {
    if (this.articleId) {
      const data = await firstValueFrom(this.articleService.getArticles());
      console.log(data);
      this.article = data.find((res) => Number(this.articleId) == res.id);
      console.log(this.article);
      this.storedArticles = this.article;
    }
  }

  public async loadNewData() {
    const newlyAddedData = this.articleService.getStoredArticles();
    if (newlyAddedData.length > 0 && this.articleId) {
      this.sharedService.newlyaddedData.subscribe((res) => {
        if (res?.length !== 0) {
          this.article = res;
        }
        return res;
      });
      console.log(this.article);
    }
    // if (newlyAddedData.length > 0 && this.articleId) {
    //   this.sharedService.newlyaddedData.subscribe(
    //     (res) => (this.article = res)
    //   );
    //   console.log(this.article);
    // }
  }

  public fetchrelatedArticles(): void {
    this.articleService.getArticles().subscribe((data: any[]) => {
      this.relatedArticles = data;
    });
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  public readMore(index: number) {
    const selectedArticle = this.relatedArticles[index];
    this.article = selectedArticle;
    this.router.navigate(['/article', selectedArticle.id]).then(() => {
      window.location.reload();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
