import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { SessionService } from 'src/app/services';
import { SignInService } from './sign-in.service';
import { LoginData } from './models';
import { ServerResponseError } from 'src/app/models';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass'],
  providers: [SignInService],
})
export class SignInComponent {

  readonly form: FormGroup;
  pending = false;
  errorMsg: string = null;

  constructor(
    formBuilder: FormBuilder,
    private readonly signInService: SignInService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
  ) {
    this.form = formBuilder.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(64),
          Validators.minLength(8),
        ]),
      ],
    });
  }

  signIn(data: LoginData): void {
    if (this.form.invalid || this.pending) return;

    this.pending = true;
    this.form.disable();
    this.errorMsg = null;

    this.signInService
      .login(data)
      .pipe(
        finalize(() => {
          this.pending = false;
          this.form.enable();
        }),
      )
      .subscribe(
        (response) => {
          this.sessionService.sessionId = response.sessionId;
          this.router.navigate(['/login/otp']);
        },
        (err: unknown) => {
          if (
            typeof err === 'object' &&
            'error' in err &&
            typeof err['error'] === 'object' &&
            'errorMsg' in err['error'] &&
            typeof err['error']['errorMsg'] === 'string'
          ) { 
            this.errorMsg = ((err as HttpErrorResponse).error as ServerResponseError).errorMsg;
            return;
          }

          this.errorMsg = 'Unknown error';
        },
      );
  }

}
