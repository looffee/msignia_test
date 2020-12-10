import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { OtpCheckResponse } from './models';

import { Observable } from 'rxjs';

@Injectable()
export class OtpCheckService {

  constructor(
    private readonly http: HttpClient,
  ) {}

  checkOtp(otp: string): Observable<OtpCheckResponse> {
    return this.http.post<OtpCheckResponse>('otp', { code: otp });
  }

}