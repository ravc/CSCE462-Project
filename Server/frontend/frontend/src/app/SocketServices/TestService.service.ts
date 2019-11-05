import { Injectable } from '@angular/core';
import { WebSocketService } from './WebSocketService.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TestService {
    messages: Subject<any>;
    
    constructor(private ws: WebSocketService) {
        this.messages = <Subject<any>>ws.connect().pipe(map((response: any): any => {
            return response;
        }))
    }
    
    testConnection(msg) {
        this.messages.next(['test', msg]);
    }
}
