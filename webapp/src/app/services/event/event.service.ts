import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';

import { API_ROUTES } from '../api/routes';
import { ApiMapperService } from '../api';
import { AuthService } from '../auth';
import {
  ConferenceEvent,
  Comment,
} from '../../models';

@Injectable()
export class EventService {

  /**
   * Constructor for the event service.
   */
  constructor(
    private apiMapperService: ApiMapperService,
    private authService: AuthService,
    private authHttp: AuthHttp,
    private http: Http,
  ) { }

  private get httpService (): Http | AuthHttp {
    if (this.authService.loggedIn) {
      return this.authHttp;
    } else {
      return this.http;
    }
  }

  /**
   * Returns all events of the conference
   *
   * @return {Observable<Event[]>} An observable containing a list of all events
   */
  public getAll (): Observable<ConferenceEvent[]> {
    return this.httpService.get(API_ROUTES.events.all)
      .map(res => res.json())
      .map(list => list.map(this.apiMapperService.eventApiToLocal));
  }

  public getFavorites (): Observable<ConferenceEvent[]> {
    return this.httpService.get(API_ROUTES.events.favorites)
      .map(res => res.json())
      .map(list => list.map(this.apiMapperService.eventApiToLocal));
  }

  public getEvent (eventId: number): Observable<ConferenceEvent> {
    return this.httpService.get(API_ROUTES.events.single.replace(':eventId', eventId.toString(10)))
      .map(res => res.json())
      .map(this.apiMapperService.eventApiToLocal);
  }

  public getEventOfSpeaker (personId: string): Observable<ConferenceEvent> {
    return this.httpService.get(API_ROUTES.events.ofSpeaker.replace(':personId', personId))
      .map(res => res.json())
      .map(list => list.map(this.apiMapperService.eventApiToLocal));
  }

  /**
   * Updates the favour status of an event.
   *
   * @param {ConferenceEvent} event The event whose favour status to update.
   * @return void
   */
  public updateFavourStatus(event: ConferenceEvent): void {
    if (event.favored) {
      this.authHttp.post(API_ROUTES.events.favorite.replace(':eventid', event.id), { })
        .subscribe(_ => null);
    } else {
      this.authHttp.delete(API_ROUTES.events.favorite.replace(':eventid', event.id))
        .subscribe(_ => null);
    }
  }

 /** retrieves comments for a single event
  * @param {string} eventId Id of the event the comment is connected to
  * @return {Observable<Comment[]>}
  */
  public getComments (eventId: string): Observable<Comment[]> {
    return this.httpService.get(API_ROUTES.events.comments
      .replace(':eventId', eventId))
      .map(res => res.json())
      .map(cs => cs.map(Comment.fromAPI));
  }

 /** posts comment for an event
  * @param {string} eventId of the event 
  * @param {string} comment the actual comments messsage
  *
  * @return {Observable<any>}
  */
  public addComment (eventId: string, comment: string ): Observable<any> {
    return this.httpService.post(API_ROUTES.events.comments
      .replace(':eventId', eventId), {
        comment: comment,
      });
  }
}
