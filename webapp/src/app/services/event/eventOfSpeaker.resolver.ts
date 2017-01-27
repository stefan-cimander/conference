import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { EventService } from '../event';
import { ConferenceEvent } from '../../models';

@Injectable()
export class EventOfSpeakerResolver implements Resolve<ConferenceEvent> {

  constructor (
    private eventService: EventService,
  ) {}

  public resolve (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<ConferenceEvent> {
     return this.eventService.getEventOfSpeaker(route.params['personId']);
  }

}