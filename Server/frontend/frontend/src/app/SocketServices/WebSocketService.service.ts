import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})

export class WebSocketService {
    private socket;
    
    constructor() {}
    
    connect(): Subject<MessageEvent> {
        this.socket = io(environment.websocketURL);
        this.socket.nsp = '/frontend';
        
        let observable = new Observable(observer => {
            this.socket.on('connect', (data) => {
                if (data == true) {
                    console.log('Connection was made');
                }
            })
            
            this.socket.on('chart_data', (data) => {
                observer.next({'chart': data});
            })
            
            this.socket.on('all_plants', (data) => {
                observer.next({'plants': data});
            })
            
            return () => {
                this.socket.disconnect();
            }
        });
        
        let observer = {
            next: (data: [String, Object]) => {
                this.socket.emit(data[0], data[1]);
            },
        };
        
        return Subject.create(observer, observable);
    }
}
