import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { QuillModule } from 'ngx-quill';
import { ArticlesService } from '../services/articles.service';
import { SharedService } from '../services/shared.service';
import { DialogModalComponent } from '../dialog-modal/dialog-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    QuillModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreatePostComponent),
      multi: true,
    },
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent implements ControlValueAccessor, OnInit {
  public blogForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    author: new FormControl('', [Validators.required]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(20),
    ]),
    category: new FormControl('', [Validators.required]),
    publishDate: new FormControl('', [Validators.required]),
  });

  constructor(
    private articleService: ArticlesService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const state = history.state;
    if (state && state.draft) {
      this.blogForm.patchValue(state.draft);
    }
  }

  categories = ['Technology', 'Lifestyle', 'Business', 'Entertainment'];

  onChange = (value: any) => {};
  onTouched = () => {};

  public writeValue(value: any): void {
    this.blogForm.get('description')?.setValue(value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    const contentControl = this.blogForm.get('description');
    if (isDisabled) {
      contentControl?.disable();
    } else {
      contentControl?.enable();
    }
  }

  saveDraft() {
    const blogData = this.blogForm.value;
    this.articleService.saveDraft(blogData);
    this.sharedService.blogData.next(blogData);
    this.sharedService.modalTitle.next(`Drafts`);
    this.sharedService.modalMessage.next('Saved into Drafts');
    this.dialog.open(DialogModalComponent);
    this.router.navigate(['/drafts']);
  }

  publish() {
    const blogData = this.blogForm.value;
    this.articleService.saveArticle(blogData);
    this.sharedService.modalTitle.next(`publish`);
    this.sharedService.modalMessage.next(
      'Your blog have been successfully published'
    );
    this.dialog.open(DialogModalComponent);
    this.router.navigate(['/']);
  }
}
