import { Component } from '@angular/core';
import { PlantService } from '../SocketServices/PlantService.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
    plants = [''];
    activePlant = [''];
    
    constructor(private plantService: PlantService) {}
    
    ngOnInit() {
        this.plantService.data.subscribe(data => {
            if (typeof data !== 'undefined' && 'plants' in data) {
                this.setPlants(data['plants']);
            }
        });
        
        this.plantService.getPlants();
    }
    
    setPlants(data) {
        console.log(data);
        this.plants = data;
        this.activePlant = data[0];
    }
}
