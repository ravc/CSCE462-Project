import { Component, Input } from '@angular/core';

@Component({
  selector: 'plants',
  templateUrl: 'plants.component.html',
  styleUrls: ['plants.component.css']
})

export class PlantComponent {
    @Input() plant;
}
