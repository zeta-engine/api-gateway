import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('ANTES');
    const initialDate = Date.now();

    return next.handle().pipe(
      tap(() => console.log(`DEPOIS... ${Date.now() - initialDate} ms`))
    );
  }
}