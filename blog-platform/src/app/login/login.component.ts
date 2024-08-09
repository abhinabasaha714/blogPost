import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Auth,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from '../dialog-modal/dialog-modal.component';
import { User } from '../store/interface/user.model';
import { Store } from '@ngrx/store';
import { loginFailure, loginSuccess } from '../store/actions/auth.action';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public onSubmit() {
    const { email, password } = this.loginForm.value;
    const auth = getAuth();
    console.log(auth);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user: User = {
          uid: userCredential.user.uid,
          email: email,
        };
        this.store.dispatch(loginSuccess({ user }));
        this.sharedService.modalTitle.next(`Hello ${email}`);
        this.sharedService.modalMessage.next(
          `You have been logged in successfully`
        );
        this.dialog.open(DialogModalComponent);
        this.router.navigate(['']);
      })
      .catch((error) => {
        this.store.dispatch(loginFailure({ error }));
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  public loginWithGoogle() {
    const { email } = this.loginForm.value;
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((credentials) => {
        const user = {
          uid: credentials.user.uid,
          email: email,
        };
        this.store.dispatch(loginSuccess({ user }));
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.store.dispatch(loginFailure({ error }));
      });
  }

  public loginWithGithub() {
    const { email } = this.loginForm.value;
    const provider = new GithubAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((credentials) => {
        const user = {
          uid: credentials.user.uid,
          email: email,
        };
        this.store.dispatch(loginSuccess({ user }));
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.store.dispatch(loginFailure({ error }));
      });
  }
}
