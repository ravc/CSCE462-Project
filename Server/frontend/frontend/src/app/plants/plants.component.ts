import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'plants',
  templateUrl: 'plants.component.html',
  styleUrls: ['plants.component.css']
})

export class PlantComponent {
    @Input() plant;
    
    constructor(private httpClient: HttpClient) {}
    
    changeSolenoidState() {
        this.httpClient.get<String>("http://" + this.plant[1] + "/solenoid_override").subscribe(data => {
            console.log(data);
        })
    }
    
    changeHeatPadState() {
        this.httpClient.get("http://" + this.plant[1] + "/heat_override").subscribe(data => {
            console.log(data);
        })
    }
}
