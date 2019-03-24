import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

declare module 'rxjs' {
  interface Observable < T > {
    debug: (...any) => Observable < T > ;
  }
}

Observable.prototype.debug = function (message: string) {
  return this.pipe(
    tap(
      (next) => {
        if (!environment.production) {
          console.log(message, next);
        }
      },
      (err) => {
        if (!environment.production) {
          console.error(err);
        }
      },
      () => {
        if (!environment.production) {
          console.log('complete');
        }
      },
    )
  );
};
