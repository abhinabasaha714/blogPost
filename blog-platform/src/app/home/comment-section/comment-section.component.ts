import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

interface Comment {
  author: string;
  text: string;
  timestamp: Date;
  replies: Comment[];
  showReply?: boolean;
}

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
})
export class CommentSectionComponent {
  @Output() closeComments = new EventEmitter<void>();

  comments: Comment[] = [];
  newComment: string = '';
  newReply: string = '';
  replyIndex: number | null = null;

  constructor() {
    this.loadComments();
  }

  addComment(): void {
    if (this.newComment.trim()) {
      const newComment: Comment = {
        author: 'User',
        text: this.newComment,
        timestamp: new Date(),
        replies: [],
      };
      this.comments.push(newComment);
      this.saveComments();
      this.newComment = '';
    }
  }

  toggleReply(index: number): void {
    this.replyIndex = this.replyIndex === index ? null : index;
  }

  addReply(index: number): void {
    if (this.newReply.trim()) {
      const newReply: Comment = {
        author: 'User',
        text: this.newReply,
        timestamp: new Date(),
        replies: [],
      };
      this.comments[index].replies.push(newReply);
      this.saveComments();
      this.newReply = '';
      this.replyIndex = null;
    }
  }

  saveComments(): void {
    localStorage.setItem('comments', JSON.stringify(this.comments));
  }

  loadComments(): void {
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      this.comments = JSON.parse(storedComments);
      console.log(this.comments);
    }
  }

  close(): void {
    this.closeComments.emit();
  }
}
