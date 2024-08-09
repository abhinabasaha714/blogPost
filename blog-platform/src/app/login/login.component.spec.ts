import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Auth } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SharedService } from '../services/shared.service';
import { loginFailure } from '../store/actions/auth.action';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: any;
  let mockDialog: any;
  let mockStore: any;
  let mockAuth: any;
  let mockSharedService: any;

  beforeEach(async () => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockDialog = { open: jasmine.createSpy('open') };
    mockStore = { dispatch: jasmine.createSpy('dispatch') };
    mockAuth = jasmine.createSpyObj('Auth', [
      'signInWithEmailAndPassword',
      'signInWithPopup',
    ]);
    mockSharedService = {
      modalTitle: { next: jasmine.createSpy('next') },
      modalMessage: { next: jasmine.createSpy('next') },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent, BrowserAnimationsModule],
      declarations: [],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Store, useValue: mockStore },
        { provide: Auth, useValue: mockAuth },
        { provide: SharedService, useValue: mockSharedService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when email and password are filled', () => {
    component.loginForm.controls['email'].setValue('abhi@example.com');
    component.loginForm.controls['password'].setValue('876543');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should have an invalid form when email is empty', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('6762483');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should dispatch loginSuccess and navigate on successful login', async () => {
    const email = 'abhi@example.com';
    const password = '455776';
    component.loginForm.controls['email'].setValue(email);
    component.loginForm.controls['password'].setValue(password);
    const userCredential = { user: { uid: '123' } };
    mockAuth.signInWithEmailAndPassword.and.returnValue(
      Promise.resolve(userCredential)
    );
    component.onSubmit();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should dispatch loginFailure on login error', async () => {
    component.loginForm.controls['email'].setValue('abhi@example.com');
    component.loginForm.controls['password'].setValue('123456');

    const error = { code: 'auth/wrong-password', message: 'Wrong password' };
    mockAuth.signInWithEmailAndPassword.and.returnValue(Promise.reject(error));
    component.onSubmit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(loginFailure({ error }));
    expect(mockDialog.open).not.toHaveBeenCalled();
  });

  it('should dispatch loginSuccess and navigate on Google login', async () => {
    component.loginForm.controls['email'].setValue('abhi@example.com');

    const credentials = { user: { uid: '123' } };
    mockAuth.signInWithPopup.and.returnValue(Promise.resolve(credentials));
    component.loginWithGoogle();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should dispatch loginFailure on Google login error', async () => {
    const error = {
      code: 'auth/popup-closed-by-user',
      message: 'Popup closed by user',
    };
    mockAuth.signInWithPopup.and.returnValue(Promise.reject(error));
    component.loginWithGoogle();
    expect(mockStore.dispatch).toHaveBeenCalledWith(loginFailure({ error }));
  });

  it('should dispatch loginSuccess and navigate on GitHub login', async () => {
    component.loginForm.controls['email'].setValue('abhi@example.com');

    const credentials = { user: { uid: '123' } };
    mockAuth.signInWithPopup.and.returnValue(Promise.resolve(credentials));
    component.loginWithGithub();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should dispatch loginFailure on GitHub login error', async () => {
    const error = {
      code: 'auth/popup-closed-by-user',
      message: 'Popup closed by user',
    };
    mockAuth.signInWithPopup.and.returnValue(Promise.reject(error));
    component.loginWithGithub();
    expect(mockStore.dispatch).toHaveBeenCalledWith(loginFailure({ error }));
  });
});
