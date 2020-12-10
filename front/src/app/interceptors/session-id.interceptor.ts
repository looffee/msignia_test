import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

import { SessionService } from 'src/app/services';

import { Observable } from 'rxjs';

@Injectable()
export class SessionIdInterceptor implements HttpInterceptor {

  constructor(
    private readonly sessionService: SessionService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      typeof req.body === 'object' &&
      this.sessionService.sessionId
    ) {
      return next.handle(
        req.clone({
          body: {
            sessionId: this.sessionService.sessionId,
            ...req.body,
          },
        }),
      );
    }

    return next.handle(req);
  }

}
