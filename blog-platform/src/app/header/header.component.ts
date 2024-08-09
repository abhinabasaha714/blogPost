import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/state/auth.state';
import { logout } from '../store/actions/auth.action';
import { SharedService } from '../services/shared.service';
import { DialogModalComponent } from '../dialog-modal/dialog-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public isAuthenticated = false;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private sharedService: SharedService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((auth) => {
      this.isAuthenticated = auth.isAuthenticated;
    });
  }

  public onLogout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.store.dispatch(logout());
      this.store.select('auth').subscribe((auth) => {
        this.isAuthenticated = auth.isAuthenticated;
      });
      this.sharedService.modalTitle.next(`You want to logout`);
      this.sharedService.modalMessage.next(
        `You have been logged out successfully`
      );
      this.dialog.open(DialogModalComponent);
      this.router.navigate(['']);
    });
  }
}
