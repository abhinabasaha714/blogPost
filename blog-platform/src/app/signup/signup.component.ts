import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { DialogModalComponent } from '../dialog-modal/dialog-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm);
      const { username, email, password } = this.signupForm.value;
      try {
        await createUserWithEmailAndPassword(this.auth, email, password);
        this.router.navigate(['/login']);
        this.sharedService.modalTitle.next(`Hello ${username}`);
        this.sharedService.modalMessage.next(
          `You have been signed up successfully`
        );
        this.dialog.open(DialogModalComponent);
      } catch (error: any) {
        alert('Error: ' + error.message);
      }
    }
  }
}
