import { Component } from '@angular/core';
import {
  FormControl,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { OtpCheckService } from './otp-check.service';
import { ServerResponseError } from 'src/app/models';
import { SessionService } from 'src/app/services';

import {
  interval,
  Observable,
} from 'rxjs';
import {
  finalize,
  map,
  takeWhile,
  startWith,
} from 'rxjs/operators';

@Component({
  selector: 'app-otp-check',
  templateUrl: './otp-check.component.html',
  styleUrls: ['./otp-check.component.sass'],
  providers: [OtpCheckService],
})
export class OtpCheckComponent {

  readonly otpControl: FormControl;
  countdown$: Observable<number> = null;
  errorMsg: string = null;
  pending = false;

  constructor(
    private readonly otpCheckService: OtpCheckService,
    private readonly sessionService: SessionService,
  ) {
    this.otpControl = new FormControl(null, Validators.required);
    this.restartCountdown();
  }

  checkOtp(otp: string): void {
    if (this.otpControl.invalid || this.pending) return;

    this.pending = true;
    this.otpControl.disable();
    this.errorMsg = null;

    this.otpCheckService
      .checkOtp(otp)
      .pipe(
        finalize(() => {
          this.pending = false;
          this.otpControl.enable();
        }),
      )
      .subscribe(
        (response) => {
          this.sessionService.sessionId = response.sessionId;
          alert('Success');
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

  restartCountdown(): void {
    this.countdown$ = interval(1000)
      .pipe(map((v) => v + 1))
      .pipe(startWith(0))
      .pipe(map((v) => 30 - v))
      .pipe(takeWhile((v) => v >= 0))
      .pipe(finalize(() => this.countdown$ = null));
  }

}
