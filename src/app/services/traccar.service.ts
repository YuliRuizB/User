import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
}) 
export class TraccarService { 
 
    
  constructor(private http: HttpClient) {


  }

}
