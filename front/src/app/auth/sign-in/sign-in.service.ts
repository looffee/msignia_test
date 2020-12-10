import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  LoginResponse,
  LoginData,
} from './models';

import { Observable } from 'rxjs';

@Injectable()
export class SignInService {

  constructor(
    private http: HttpClient,
  ) {}

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('login', data);
  }

}