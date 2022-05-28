import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ChangeDetectorRef, Injectable, OnInit } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})

// export class InterceptorService {}
export class InterceptorService implements HttpInterceptor {
  private totalRequests = 0;
  constructor(public loaderService: LoaderService) { }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  //   this.totalRequests++;
  //   console.log("req" + this.totalRequests);
  //   setTimeout(() => { this.loaderService.isLoading.next(true); }, 0)
  //   return next.handle(req).pipe(
  //     finalize(() => {
  //       console.log("obradioreq" + this.totalRequests);
  //       this.totalRequests--;
 
  //         this.loaderService.isLoading.next(false);
  //         console.log("Obradio poslednji req");
        
  //     }
  //     )
  //   );
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.totalRequests++;
   // console.log("req" + this.totalRequests);
    setTimeout(() => { this.loaderService.isLoading.next(true); },0)
    return next.handle(req).pipe(
      finalize(() => {
     //   console.log("obradioreq" + this.totalRequests);
        this.totalRequests--;
        if (this.totalRequests == 0){
          setTimeout(() => { this.loaderService.isLoading.next(false); },0)
       //   console.log("Obradio poslednji req");
        }
      }
      )
    );
  }
}
