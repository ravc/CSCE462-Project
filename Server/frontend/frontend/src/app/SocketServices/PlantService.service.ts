import { Injectable } from '@angular/core';
import { WebSocketService } from './WebSocketService.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PlantService {
    data: Subject<any>;
    
    constructor(private ws: WebSocketService) {
        this.data = <Subject<any>>ws.connect().pipe(map((response: any): any => {
            return response;
        }))
    }
    
    getPlants() {
        this.data.next(['plants', '']);
    }
}
