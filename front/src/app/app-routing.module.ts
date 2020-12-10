import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
} from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { OtpCheckComponent } from './auth/otp-check/otp-check.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: SignInComponent,
      },
      {
        path: 'otp',
        component: OtpCheckComponent,
      },
    ],
  },
  {
    path: 'sign-up',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: SignUpComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
