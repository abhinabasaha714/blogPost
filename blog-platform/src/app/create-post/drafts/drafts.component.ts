import { Component } from '@angular/core';
import { ArticlesService } from '../../services/articles.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from '../../dialog-modal/dialog-modal.component';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.scss',
})
export class DraftsComponent {
  drafts: any = [];
  defaultPhoto: any =
    'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=';
  blogData: any;
  constructor(
    private articleService: ArticlesService,
    private sharedService: SharedService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchDrafts();
    this.sharedService.blogData.subscribe((res) => (this.blogData = res));
  }

  public fetchDrafts(): void {
    this.drafts = this.articleService.getStoredDrafts();
    this.drafts = this.drafts.map((res: any) => {
      console.log(res);
      res.description = this.removeHTMLTags(res.description);
      return res;
    });
    console.log(this.drafts);
  }

  public removeHTMLTags(str: string) {
    return str.replace(/<\/?[^>]+(>|$)/g, '');
  }

  public publish(index: number): void {
    this.blogData = {
      title: this.drafts[index].title,
      description: this.drafts[index].description,
      id: this.drafts.length + index + 1,
      thumbnail: this.defaultPhoto,
      author: this.drafts[index]?.author,
      publishDate: this.drafts[index]?.publishDate,
      featured: false,
      type: this.drafts[index]?.type,
      tags: ['lifestyle'],
    };
    this.articleService.saveArticle(this.blogData);
    this.sharedService.modalTitle.next(`Publish`);
    this.sharedService.modalMessage.next('Successfully published');
    this.dialog.open(DialogModalComponent);
    this.router.navigate(['/']);
  }

  public remove(index: number): void {
    this.articleService.deleteDraft(index);
    this.fetchDrafts();
  }

  public editDraft(draft: any) {
    this.router.navigate(['/create-post'], { state: { draft } });
  }
}
