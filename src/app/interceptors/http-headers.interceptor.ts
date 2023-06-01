import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment as env } from "src/environments/environment.prod";


@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders: {
                'X-RapidAPI-Key': env.X_RapidAPI_Key,
                'X-RapidAPI-Host': env.X_RapidAPI_Host
            },
            setParams: {
                key: env.game_API_key
            }
        });
        return next.handle(req);
    }
}