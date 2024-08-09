import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Article } from '../../../services/articles.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent {
  @Input() article!: Article;

  constructor(private router: Router, private sharedService: SharedService) {}

  public readMore() {
    this.sharedService.newlyaddedData.next(this.article);
    console.log('this is read more', this.article);
    this.router.navigate(['/article', this.article.id]);
  }
}
