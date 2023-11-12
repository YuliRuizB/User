import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
/* import { Message } from "../models/websocket.types";
import { Position } from "../models/positions.types";
import { Event } from "../models/events.types";
import { Device } from "../models/device.types"; */

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const SOCKET_URL = `${protocol}//${window.location.host}/api/socket`;

@Injectable()
export class WebsocketService {

  // -----------------------------------------------------------------------------------------------------
  // @ Private
  // -----------------------------------------------------------------------------------------------------

  /**
   *
   * Events
   * @private
   * @type {(BehaviorSubject<any[] | null>)}
   * @memberof WebsocketService
   */
  private _events: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  /**
   *
   * Positions
   * @private
   * @type {(BehaviorSubject<any[] | null>)}
   * @memberof WebsocketService
   */
  private _positions: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  /**
   *
   * Devices
   * @private
   * @type {(BehaviorSubject<any[] | null>)}
   * @memberof WebsocketService
   */
  private _devices: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  /**
   *
   * Messages Subject
   * @private
   * @type {AnonymousSubject<any>}
   * @memberof WebsocketService
   */
  private subject: AnonymousSubject<any>;

  // -----------------------------------------------------------------------------------------------------
  // @ Public
  // -----------------------------------------------------------------------------------------------------

  /**
   *
   * Messages
   * @type {Subject<any>}
   * @memberof WebsocketService
   */
  public messages: Subject<any>;

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * getter for events
   */
  get events$(): Observable<any[] | null> {
    return this._events.asObservable();
  }

  /**
   * getter for positions
   */
  get positions$(): Observable<any[] | null> {
    return this._positions.asObservable();
  }

  /**
   * getter for devices
   */
  get devices$(): Observable<any[] | null> {
    return this._devices.asObservable();
  }

  /**
   * getter for a single event
   * @param eventId 
   * @returns Event observable
   */
  getEvent$(eventId: number): Observable<any | null> {
    return this._events.pipe(
      map((events: any[]) => {
        let event = events.filter(event => event.id === eventId);
        return event[0];
      })
    );
  } 

  /**
   * Constructor
   */
  constructor() {
    this.messages = <Subject<any>>this.connect(SOCKET_URL).pipe(
      map(
        (response: any): any => {
          let data = JSON.parse(response.data)

          if (data.devices) {
            // console.log('devices: ', data.devices);
            this._devices.next(data.devices);
          }
          if (data.positions) {
            // console.log('positions: ', data.positions);
            this._positions.next(data.positions);
          }
          if (data.events) {
            console.log('events: ', data.events);
            this._events.next(data.events);
          }
          return data;
        }
      )
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Connect
   * @param url 
   * @returns Subject of MessageEvent
   */
  public connect(url): AnonymousSubject<any> {
    if (!this.subject) {
      this.subject = this.create(url);
      // console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  /**
   * Create WebSocket connection
   * @param url 
   * @returns 
   */
  private create(url): AnonymousSubject<any> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<any>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      error: null,
      complete: null,
      next: (data: Object) => {
        // console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return new AnonymousSubject<any>(observer, observable);
  }

  onWebSocketMessage(observer: Observer<any>): Observer<any> {
    return observer.next.bind(observer);
  }
}