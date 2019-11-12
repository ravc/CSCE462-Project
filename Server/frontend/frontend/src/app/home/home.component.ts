import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
    plants = [
        {
            name: 'Plant 1',
            ip: '192.268.0.1'
        },
        {
            name: 'Plant 2',
            ip: '192.268.0.2'
        },
        {
            name: 'Plant 3',
            ip: '192.268.0.3'
        },
        {
            name: 'Plant 4',
            ip: '192.268.0.4'
        }
    ];
    
    activePlant = this.plants[0];
    
    test(p) {
        console.log(p)
    }
}
