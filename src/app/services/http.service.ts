import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { environment as env } from '../../environments/environment.prod'
import { APIResponse, Game } from 'src/models.';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);

    if (search) {
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params,
    });
  }

  getGame(id: string): Observable<any> {
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`);
    // const gameTrailerRequest = this.http.get<any>(
    //   `${env.BASE_URL}/games/${id}/movies`
    // );
    // const gameScreenShotRequest = this.http.get(
    //   `${env.BASE_URL}/games/${id}/screenshots`
    // );

    return forkJoin({
      gameInfoRequest,
      // gameTrailerRequest, 
      // gameScreenShotRequest
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          // screenshots: resp['gamesScreenshotsRequest']?.results,
          trailers: resp['gameTrailerRequest']?.results
        }
      })
    )
  }
}
