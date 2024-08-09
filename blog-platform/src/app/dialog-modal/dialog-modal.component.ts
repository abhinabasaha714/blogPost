import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-dialog-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './dialog-modal.component.html',
  styleUrl: './dialog-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogModalComponent implements OnInit, OnDestroy {
  public title: string = '';
  public description: string = '';

  constructor(private sharedServce: SharedService) {}

  ngOnInit(): void {
    this.sharedServce.modalTitle.subscribe((res) => (this.title = res));
    this.sharedServce.modalMessage.subscribe((res) => (this.description = res));
  }
  ngOnDestroy(): void {
    this.sharedServce.modalTitle.unsubscribe();
    this.sharedServce.modalMessage.unsubscribe();
  }
}
