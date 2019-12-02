import { Injectable } from '@angular/core';
import { WebSocketService } from './WebSocketService.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ChartService {
    data: Subject<any>;
    
    constructor(private ws: WebSocketService) {
        this.data = <Subject<any>>ws.connect().pipe(map((response: any): any => {
            return response;
        }))
    }
    
    refresh(plant) {
        this.data.next(['charts', plant])
    }
}
