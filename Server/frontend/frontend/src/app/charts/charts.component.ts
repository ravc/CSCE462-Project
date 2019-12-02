import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartService } from '../SocketServices/ChartService.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartComponent {
    _plant: String;
    get plant(): [String] {
        return [this._plant];
    }
    @Input('plant')
    set plant(value: [String]) {
        this._plant = value[0];
        
        this.httpClient.get(environment.websocketURL + "chart_data/" + value[0]).subscribe(data => {
            this.moistureData = data['moisture'];
            this.photoData = data['photo'];
            this.tempData = data['temp'];
            this.humidityData = data['humidity'];
            this.updateData(this.moistureData, this.photoData, this.tempData, this.humidityData);
        })
    }
    moistureData = [];
    photoData = [];
    tempData = [];
    humidityData = [];
    updateFromInput = false;
    
    moistureChart = Highcharts;
    moistureOptions = {   
      chart: {
         type: "spline"
      },
      title: {
         text: 'Moisture'
      },
      yAxis: {          
         title:{
            text:"Moisture Level"
         }
      },
      xAxis: {
          type: 'datetime'
      },
      tooltip: {
         valueSuffix:" %"
      },
      exporting: {
          enabled: true
      },
      series: [
      {name: 'Moisture', data: this.moistureData}
      ]
    };
    
    photoChart = Highcharts;
    photoOptions = {   
      chart: {
         type: "spline"
      },
      title: {
         text: 'Light Levels'
      },
      yAxis: {          
         title:{
            text:"Light Level"
         }
      },
      xAxis: {
          type: 'datetime'
      },
      tooltip: {
         valueSuffix:" Lumens"
      },
      exporting: {
          enabled: true
      },
      series: [
      {name: 'Photo', data: this.photoData}
      ]
    };
    
    tempChart = Highcharts;
    tempOptions = {   
      chart: {
         type: "spline"
      },
      title: {
         text: 'Temperature'
      },
      yAxis: {          
         title:{
            text:"Temperature"
         }
      },
      xAxis: {
          type: 'datetime'
      },
      tooltip: {
         valueSuffix: " °F"
      },
      exporting: {
          enabled: true
      },
      series: [
      {name: 'Temperature', data: this.tempData}
      ]
    };
    
    humidityChart = Highcharts;
    humidityOptions = {   
      chart: {
         type: "spline"
      },
      title: {
         text: 'Humidity'
      },
      yAxis: {          
         title:{
            text:"Humidity Level"
         }
      },
      xAxis: {
          type: 'datetime'
      },
      tooltip: {
         valueSuffix:" %"
      },
      exporting: {
          enabled: true
      },
      series: [
      {name: 'Humidity', data: this.moistureData}
      ]
    };
    chartCallBack;
    chart;
    
    constructor(private httpClient: HttpClient) {
        const self = this;
        
        this.chartCallBack = chart => {
            self.chart = chart;
        };
    }
    
    ngOnInit() {
    }
    
    updateData(moisture, photo, temp, humidity) {
        this.moistureOptions.series = [{data: moisture, name: 'Moisture'}];
        this.photoOptions.series = [{data: photo, name: 'Photo'}];
        this.tempOptions.series = [{data: temp, name: 'Temperature'}];
        this.humidityOptions.series = [{data: humidity, name: 'Humidity'}]
        
        this.updateFromInput = true;
    }
}
